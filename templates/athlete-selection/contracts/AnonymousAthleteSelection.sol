// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint8, euint32, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract AnonymousAthleteSelection is SepoliaConfig {

    address public selectionCommittee;
    uint32 public currentSelectionId;
    uint256 public registrationDeadline;
    uint256 public evaluationDeadline;

    struct AthleteProfile {
        euint8 encryptedPerformanceScore;
        euint8 encryptedFitnessLevel;
        euint8 encryptedExperienceYears;
        euint32 encryptedAge;
        bool isRegistered;
        bool isEvaluated;
        uint256 registrationTime;
    }

    struct SelectionProcess {
        string sportCategory;
        euint8 minPerformanceRequired;
        euint8 minFitnessRequired;
        euint8 minExperienceRequired;
        euint32 maxAgeAllowed;
        bool isActive;
        bool isCompleted;
        uint256 startTime;
        uint256 endTime;
        address[] registeredAthletes;
        address[] selectedAthletes;
        uint32 maxSelections;
    }

    mapping(uint32 => SelectionProcess) public selectionProcesses;
    mapping(uint32 => mapping(address => AthleteProfile)) public athleteProfiles;
    mapping(address => bool) public authorizedEvaluators;

    event SelectionProcessStarted(uint32 indexed selectionId, string sportCategory, uint256 registrationDeadline);
    event AthleteRegistered(address indexed athlete, uint32 indexed selectionId);
    event AthleteEvaluated(address indexed athlete, uint32 indexed selectionId);
    event SelectionCompleted(uint32 indexed selectionId, uint256 selectedCount);
    event AthleteSelected(uint32 indexed selectionId, address indexed athlete);

    modifier onlyCommittee() {
        require(msg.sender == selectionCommittee, "Not authorized");
        _;
    }

    modifier onlyAuthorizedEvaluator() {
        require(authorizedEvaluators[msg.sender], "Not authorized evaluator");
        _;
    }

    modifier onlyDuringRegistration(uint32 selectionId) {
        require(selectionProcesses[selectionId].isActive, "Selection not active");
        require(block.timestamp <= registrationDeadline, "Registration period ended");
        _;
    }

    modifier onlyDuringEvaluation(uint32 selectionId) {
        require(selectionProcesses[selectionId].isActive, "Selection not active");
        require(block.timestamp > registrationDeadline && block.timestamp <= evaluationDeadline, "Not evaluation period");
        _;
    }

    constructor() {
        selectionCommittee = msg.sender;
        currentSelectionId = 1;
        authorizedEvaluators[msg.sender] = true;
    }

    function addAuthorizedEvaluator(address evaluator) external onlyCommittee {
        authorizedEvaluators[evaluator] = true;
    }

    function removeAuthorizedEvaluator(address evaluator) external onlyCommittee {
        authorizedEvaluators[evaluator] = false;
    }

    function startNewSelection(
        string memory sportCategory,
        uint8 minPerformance,
        uint8 minFitness,
        uint8 minExperience,
        uint32 maxAge,
        uint32 maxSelections,
        uint256 registrationPeriodDays,
        uint256 evaluationPeriodDays
    ) external onlyCommittee {
        require(!selectionProcesses[currentSelectionId].isActive, "Previous selection still active");

        euint8 encMinPerformance = FHE.asEuint8(minPerformance);
        euint8 encMinFitness = FHE.asEuint8(minFitness);
        euint8 encMinExperience = FHE.asEuint8(minExperience);
        euint32 encMaxAge = FHE.asEuint32(maxAge);

        registrationDeadline = block.timestamp + (registrationPeriodDays * 1 days);
        evaluationDeadline = registrationDeadline + (evaluationPeriodDays * 1 days);

        selectionProcesses[currentSelectionId] = SelectionProcess({
            sportCategory: sportCategory,
            minPerformanceRequired: encMinPerformance,
            minFitnessRequired: encMinFitness,
            minExperienceRequired: encMinExperience,
            maxAgeAllowed: encMaxAge,
            isActive: true,
            isCompleted: false,
            startTime: block.timestamp,
            endTime: evaluationDeadline,
            registeredAthletes: new address[](0),
            selectedAthletes: new address[](0),
            maxSelections: maxSelections
        });

        FHE.allowThis(encMinPerformance);
        FHE.allowThis(encMinFitness);
        FHE.allowThis(encMinExperience);
        FHE.allowThis(encMaxAge);

        emit SelectionProcessStarted(currentSelectionId, sportCategory, registrationDeadline);
    }

    function registerAthlete(
        uint8 performanceScore,
        uint8 fitnessLevel,
        uint8 experienceYears,
        uint32 age
    ) external onlyDuringRegistration(currentSelectionId) {
        require(!athleteProfiles[currentSelectionId][msg.sender].isRegistered, "Already registered");
        require(performanceScore <= 100 && fitnessLevel <= 100, "Scores must be 0-100");

        euint8 encPerformance = FHE.asEuint8(performanceScore);
        euint8 encFitness = FHE.asEuint8(fitnessLevel);
        euint8 encExperience = FHE.asEuint8(experienceYears);
        euint32 encAge = FHE.asEuint32(age);

        athleteProfiles[currentSelectionId][msg.sender] = AthleteProfile({
            encryptedPerformanceScore: encPerformance,
            encryptedFitnessLevel: encFitness,
            encryptedExperienceYears: encExperience,
            encryptedAge: encAge,
            isRegistered: true,
            isEvaluated: false,
            registrationTime: block.timestamp
        });

        selectionProcesses[currentSelectionId].registeredAthletes.push(msg.sender);

        FHE.allowThis(encPerformance);
        FHE.allowThis(encFitness);
        FHE.allowThis(encExperience);
        FHE.allowThis(encAge);
        FHE.allow(encPerformance, msg.sender);
        FHE.allow(encFitness, msg.sender);
        FHE.allow(encExperience, msg.sender);
        FHE.allow(encAge, msg.sender);

        emit AthleteRegistered(msg.sender, currentSelectionId);
    }

    function evaluateAthlete(address athlete) external onlyAuthorizedEvaluator onlyDuringEvaluation(currentSelectionId) {
        require(athleteProfiles[currentSelectionId][athlete].isRegistered, "Athlete not registered");
        require(!athleteProfiles[currentSelectionId][athlete].isEvaluated, "Already evaluated");

        AthleteProfile storage profile = athleteProfiles[currentSelectionId][athlete];
        SelectionProcess storage selection = selectionProcesses[currentSelectionId];

        ebool meetsPerformance = FHE.ge(profile.encryptedPerformanceScore, selection.minPerformanceRequired);
        ebool meetsFitness = FHE.ge(profile.encryptedFitnessLevel, selection.minFitnessRequired);
        ebool meetsExperience = FHE.ge(profile.encryptedExperienceYears, selection.minExperienceRequired);
        ebool meetsAge = FHE.le(profile.encryptedAge, selection.maxAgeAllowed);

        ebool qualifies = FHE.and(
            FHE.and(meetsPerformance, meetsFitness),
            FHE.and(meetsExperience, meetsAge)
        );

        profile.isEvaluated = true;

        FHE.allowThis(qualifies);

        // Store encrypted qualification result for later processing
        // In a real implementation, this would use async decryption
        // For now, we mark the athlete as evaluated and defer selection to finalization

        emit AthleteEvaluated(athlete, currentSelectionId);
    }

    function finalizeSelection() external onlyCommittee {
        require(block.timestamp > evaluationDeadline, "Evaluation period not ended");
        require(selectionProcesses[currentSelectionId].isActive, "Selection not active");
        require(!selectionProcesses[currentSelectionId].isCompleted, "Already completed");

        selectionProcesses[currentSelectionId].isActive = false;
        selectionProcesses[currentSelectionId].isCompleted = true;

        emit SelectionCompleted(currentSelectionId, selectionProcesses[currentSelectionId].selectedAthletes.length);

        currentSelectionId++;
    }

    function getSelectionInfo(uint32 selectionId) external view returns (
        string memory sportCategory,
        bool isActive,
        bool isCompleted,
        uint256 startTime,
        uint256 endTime,
        uint256 registeredCount,
        uint256 selectedCount,
        uint32 maxSelections
    ) {
        SelectionProcess storage selection = selectionProcesses[selectionId];
        return (
            selection.sportCategory,
            selection.isActive,
            selection.isCompleted,
            selection.startTime,
            selection.endTime,
            selection.registeredAthletes.length,
            selection.selectedAthletes.length,
            selection.maxSelections
        );
    }

    function getCurrentSelectionDeadlines() external view returns (
        uint256 registrationEnd,
        uint256 evaluationEnd
    ) {
        return (registrationDeadline, evaluationDeadline);
    }

    function isAthleteRegistered(uint32 selectionId, address athlete) external view returns (bool) {
        return athleteProfiles[selectionId][athlete].isRegistered;
    }

    function isAthleteEvaluated(uint32 selectionId, address athlete) external view returns (bool) {
        return athleteProfiles[selectionId][athlete].isEvaluated;
    }

    function getSelectedAthletes(uint32 selectionId) external view returns (address[] memory) {
        return selectionProcesses[selectionId].selectedAthletes;
    }

    function getRegisteredAthletesCount(uint32 selectionId) external view returns (uint256) {
        return selectionProcesses[selectionId].registeredAthletes.length;
    }
}