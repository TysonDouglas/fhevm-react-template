// Contract Configuration
const CONTRACT_ADDRESS = "0x88F346E27fb2425E11723938643EF698e6e547DC";
const CONTRACT_ABI = [
    "function selectionCommittee() view returns (address)",
    "function currentSelectionId() view returns (uint32)",
    "function registrationDeadline() view returns (uint256)",
    "function evaluationDeadline() view returns (uint256)",
    "function authorizedEvaluators(address) view returns (bool)",
    "function startNewSelection(string memory sportCategory, uint8 minPerformance, uint8 minFitness, uint8 minExperience, uint32 maxAge, uint32 maxSelections, uint256 registrationPeriodDays, uint256 evaluationPeriodDays)",
    "function registerAthlete(uint8 performanceScore, uint8 fitnessLevel, uint8 experienceYears, uint32 age)",
    "function evaluateAthlete(address athlete)",
    "function finalizeSelection()",
    "function addAuthorizedEvaluator(address evaluator)",
    "function removeAuthorizedEvaluator(address evaluator)",
    "function getSelectionInfo(uint32 selectionId) view returns (string memory sportCategory, bool isActive, bool isCompleted, uint256 startTime, uint256 endTime, uint256 registeredCount, uint256 selectedCount, uint32 maxSelections)",
    "function getCurrentSelectionDeadlines() view returns (uint256 registrationEnd, uint256 evaluationEnd)",
    "function isAthleteRegistered(uint32 selectionId, address athlete) view returns (bool)",
    "function isAthleteEvaluated(uint32 selectionId, address athlete) view returns (bool)",
    "function getSelectedAthletes(uint32 selectionId) view returns (address[])",
    "function getRegisteredAthletesCount(uint32 selectionId) view returns (uint256)",
    "event SelectionProcessStarted(uint32 indexed selectionId, string sportCategory, uint256 registrationDeadline)",
    "event AthleteRegistered(address indexed athlete, uint32 indexed selectionId)",
    "event AthleteEvaluated(address indexed athlete, uint32 indexed selectionId)",
    "event SelectionCompleted(uint32 indexed selectionId, uint256 selectedCount)",
    "event AthleteSelected(uint32 indexed selectionId, address indexed athlete)"
];

// Global variables
let provider;
let signer;
let contract;
let userAddress;
let isCommittee = false;
let isEvaluator = false;

// DOM Elements
const connectBtn = document.getElementById('connectBtn');
const connectionText = document.getElementById('connectionText');
const accountText = document.getElementById('accountText');
const messageArea = document.getElementById('messageArea');
const connectionCard = document.getElementById('connectionCard');
const selectionInfoCard = document.getElementById('selectionInfoCard');
const committeeCard = document.getElementById('committeeCard');
const athleteCard = document.getElementById('athleteCard');
const evaluatorCard = document.getElementById('evaluatorCard');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('App initialized');

    // Check if ethers is loaded
    if (typeof ethers === 'undefined') {
        showMessage('Ethers.js library failed to load. Please check your internet connection and refresh.', 'error');
        return;
    }

    setupEventListeners();
    checkWalletConnection();
});

// Event Listeners
function setupEventListeners() {
    connectBtn.addEventListener('click', connectWallet);
    document.getElementById('refreshBtn').addEventListener('click', loadSelectionInfo);
    document.getElementById('startSelectionBtn').addEventListener('click', startNewSelection);
    document.getElementById('addEvaluatorBtn').addEventListener('click', addEvaluator);
    document.getElementById('removeEvaluatorBtn').addEventListener('click', removeEvaluator);
    document.getElementById('finalizeBtn').addEventListener('click', finalizeSelection);
    document.getElementById('registerAthleteBtn').addEventListener('click', registerAthlete);
    document.getElementById('checkStatusBtn').addEventListener('click', checkAthleteStatus);
    document.getElementById('evaluateAthleteBtn').addEventListener('click', evaluateAthlete);
}

// Utility Functions
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageArea.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function formatDate(timestamp) {
    return new Date(timestamp * 1000).toLocaleString();
}

function setLoading(element, isLoading) {
    if (isLoading) {
        element.classList.add('loading');
        element.disabled = true;
    } else {
        element.classList.remove('loading');
        element.disabled = false;
    }
}

// Wallet Connection
async function checkWalletConnection() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                await connectWallet();
            }
        } catch (error) {
            console.error('Error checking wallet connection:', error);
        }
    }
}

async function connectWallet() {
    try {
        if (typeof window.ethereum === 'undefined') {
            showMessage('MetaMask is not installed. Please install MetaMask to continue.', 'error');
            return;
        }

        setLoading(connectBtn, true);

        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Create provider and signer
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        userAddress = await signer.getAddress();

        // Update UI
        connectionText.textContent = 'Connected';
        accountText.textContent = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;

        // Initialize contract
        if (CONTRACT_ADDRESS !== "YOUR_CONTRACT_ADDRESS_HERE") {
            contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            await checkUserRoles();
            await loadSelectionInfo();
            showUI();
        } else {
            showMessage('Please update the contract address in app.js', 'warning');
            showUI();
        }

        showMessage('Wallet connected successfully!', 'success');

        // Listen for account changes
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);

    } catch (error) {
        console.error('Error connecting wallet:', error);
        showMessage('Failed to connect wallet: ' + error.message, 'error');
    } finally {
        setLoading(connectBtn, false);
    }
}

function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        // User disconnected
        location.reload();
    } else {
        // User switched accounts
        location.reload();
    }
}

function handleChainChanged(chainId) {
    // Reload the page when chain changes
    location.reload();
}

// Contract Interactions
async function checkUserRoles() {
    try {
        if (!contract) return;

        const committeeAddress = await contract.selectionCommittee();
        isCommittee = userAddress.toLowerCase() === committeeAddress.toLowerCase();

        isEvaluator = await contract.authorizedEvaluators(userAddress);

        console.log('User roles:', { isCommittee, isEvaluator });
    } catch (error) {
        console.error('Error checking user roles:', error);
    }
}

async function loadSelectionInfo() {
    try {
        if (!contract) {
            showMessage('Contract not connected', 'warning');
            return;
        }

        const currentId = await contract.currentSelectionId();
        const selectionInfo = await contract.getSelectionInfo(currentId);
        const deadlines = await contract.getCurrentSelectionDeadlines();

        // Update UI
        document.getElementById('sportCategory').textContent = selectionInfo.sportCategory || 'None';
        document.getElementById('selectionStatus').textContent =
            selectionInfo.isActive ? 'Active' :
            selectionInfo.isCompleted ? 'Completed' : 'Inactive';
        document.getElementById('regDeadline').textContent =
            deadlines.registrationEnd > 0 ? formatDate(deadlines.registrationEnd) : 'Not set';
        document.getElementById('evalDeadline').textContent =
            deadlines.evaluationEnd > 0 ? formatDate(deadlines.evaluationEnd) : 'Not set';
        document.getElementById('registeredCount').textContent = selectionInfo.registeredCount.toString();
        document.getElementById('selectedCount').textContent = selectionInfo.selectedCount.toString();

        showMessage('Selection info updated', 'success');
    } catch (error) {
        console.error('Error loading selection info:', error);
        showMessage('Failed to load selection info: ' + error.message, 'error');
    }
}

async function startNewSelection() {
    try {
        if (!isCommittee) {
            showMessage('Only the selection committee can start new selections', 'error');
            return;
        }

        const sportCategory = document.getElementById('sportCategoryInput').value;
        const minPerformance = parseInt(document.getElementById('minPerformanceInput').value);
        const minFitness = parseInt(document.getElementById('minFitnessInput').value);
        const minExperience = parseInt(document.getElementById('minExperienceInput').value);
        const maxAge = parseInt(document.getElementById('maxAgeInput').value);
        const maxSelections = parseInt(document.getElementById('maxSelectionsInput').value);
        const regPeriod = parseInt(document.getElementById('regPeriodInput').value);
        const evalPeriod = parseInt(document.getElementById('evalPeriodInput').value);

        if (!sportCategory) {
            showMessage('Please enter a sport category', 'error');
            return;
        }

        const startBtn = document.getElementById('startSelectionBtn');
        setLoading(startBtn, true);

        const tx = await contract.startNewSelection(
            sportCategory, minPerformance, minFitness, minExperience,
            maxAge, maxSelections, regPeriod, evalPeriod
        );

        showMessage('Transaction submitted. Waiting for confirmation...', 'info');
        await tx.wait();

        showMessage('New selection process started successfully!', 'success');
        await loadSelectionInfo();

        // Clear form
        document.getElementById('sportCategoryInput').value = '';

    } catch (error) {
        console.error('Error starting selection:', error);
        showMessage('Failed to start selection: ' + error.message, 'error');
    } finally {
        setLoading(document.getElementById('startSelectionBtn'), false);
    }
}

async function addEvaluator() {
    try {
        if (!isCommittee) {
            showMessage('Only the selection committee can add evaluators', 'error');
            return;
        }

        const evaluatorAddress = document.getElementById('evaluatorAddress').value;
        if (!ethers.utils.isAddress(evaluatorAddress)) {
            showMessage('Please enter a valid address', 'error');
            return;
        }

        const addBtn = document.getElementById('addEvaluatorBtn');
        setLoading(addBtn, true);

        const tx = await contract.addAuthorizedEvaluator(evaluatorAddress);
        showMessage('Transaction submitted. Waiting for confirmation...', 'info');
        await tx.wait();

        showMessage('Evaluator added successfully!', 'success');
        document.getElementById('evaluatorAddress').value = '';

    } catch (error) {
        console.error('Error adding evaluator:', error);
        showMessage('Failed to add evaluator: ' + error.message, 'error');
    } finally {
        setLoading(document.getElementById('addEvaluatorBtn'), false);
    }
}

async function removeEvaluator() {
    try {
        if (!isCommittee) {
            showMessage('Only the selection committee can remove evaluators', 'error');
            return;
        }

        const evaluatorAddress = document.getElementById('evaluatorAddress').value;
        if (!ethers.utils.isAddress(evaluatorAddress)) {
            showMessage('Please enter a valid address', 'error');
            return;
        }

        const removeBtn = document.getElementById('removeEvaluatorBtn');
        setLoading(removeBtn, true);

        const tx = await contract.removeAuthorizedEvaluator(evaluatorAddress);
        showMessage('Transaction submitted. Waiting for confirmation...', 'info');
        await tx.wait();

        showMessage('Evaluator removed successfully!', 'success');
        document.getElementById('evaluatorAddress').value = '';

    } catch (error) {
        console.error('Error removing evaluator:', error);
        showMessage('Failed to remove evaluator: ' + error.message, 'error');
    } finally {
        setLoading(document.getElementById('removeEvaluatorBtn'), false);
    }
}

async function finalizeSelection() {
    try {
        if (!isCommittee) {
            showMessage('Only the selection committee can finalize selections', 'error');
            return;
        }

        const finalizeBtn = document.getElementById('finalizeBtn');
        setLoading(finalizeBtn, true);

        const tx = await contract.finalizeSelection();
        showMessage('Transaction submitted. Waiting for confirmation...', 'info');
        await tx.wait();

        showMessage('Selection process finalized successfully!', 'success');
        await loadSelectionInfo();

    } catch (error) {
        console.error('Error finalizing selection:', error);
        showMessage('Failed to finalize selection: ' + error.message, 'error');
    } finally {
        setLoading(document.getElementById('finalizeBtn'), false);
    }
}

async function registerAthlete() {
    try {
        const performance = parseInt(document.getElementById('performanceScore').value);
        const fitness = parseInt(document.getElementById('fitnessLevel').value);
        const experience = parseInt(document.getElementById('experienceYears').value);
        const age = parseInt(document.getElementById('athleteAge').value);

        if (isNaN(performance) || isNaN(fitness) || isNaN(experience) || isNaN(age)) {
            showMessage('Please fill in all fields with valid numbers', 'error');
            return;
        }

        if (performance < 0 || performance > 100 || fitness < 0 || fitness > 100) {
            showMessage('Performance and fitness scores must be between 0-100', 'error');
            return;
        }

        const registerBtn = document.getElementById('registerAthleteBtn');
        setLoading(registerBtn, true);

        const tx = await contract.registerAthlete(performance, fitness, experience, age);
        showMessage('Transaction submitted. Waiting for confirmation...', 'info');
        await tx.wait();

        showMessage('Athlete registration successful!', 'success');
        await checkAthleteStatus();
        await loadSelectionInfo();

        // Clear form
        document.getElementById('performanceScore').value = '';
        document.getElementById('fitnessLevel').value = '';
        document.getElementById('experienceYears').value = '';
        document.getElementById('athleteAge').value = '';

    } catch (error) {
        console.error('Error registering athlete:', error);
        showMessage('Failed to register athlete: ' + error.message, 'error');
    } finally {
        setLoading(document.getElementById('registerAthleteBtn'), false);
    }
}

async function checkAthleteStatus() {
    try {
        if (!contract) return;

        const currentId = await contract.currentSelectionId();
        const isRegistered = await contract.isAthleteRegistered(currentId, userAddress);
        const isEvaluated = await contract.isAthleteEvaluated(currentId, userAddress);

        document.getElementById('isRegistered').textContent = isRegistered ? 'Yes' : 'No';
        document.getElementById('isEvaluated').textContent = isEvaluated ? 'Yes' : 'No';

        showMessage('Status updated', 'success');
    } catch (error) {
        console.error('Error checking athlete status:', error);
        showMessage('Failed to check status: ' + error.message, 'error');
    }
}

async function evaluateAthlete() {
    try {
        if (!isEvaluator) {
            showMessage('Only authorized evaluators can evaluate athletes', 'error');
            return;
        }

        const athleteAddress = document.getElementById('athleteToEvaluate').value;
        if (!ethers.utils.isAddress(athleteAddress)) {
            showMessage('Please enter a valid athlete address', 'error');
            return;
        }

        const evaluateBtn = document.getElementById('evaluateAthleteBtn');
        setLoading(evaluateBtn, true);

        const tx = await contract.evaluateAthlete(athleteAddress);
        showMessage('Transaction submitted. Waiting for confirmation...', 'info');
        await tx.wait();

        showMessage('Athlete evaluation completed!', 'success');
        document.getElementById('athleteToEvaluate').value = '';

    } catch (error) {
        console.error('Error evaluating athlete:', error);
        showMessage('Failed to evaluate athlete: ' + error.message, 'error');
    } finally {
        setLoading(document.getElementById('evaluateAthleteBtn'), false);
    }
}

// UI Management
function showUI() {
    connectionCard.style.display = 'none';
    selectionInfoCard.style.display = 'block';

    if (isCommittee) {
        committeeCard.style.display = 'block';
    }

    if (isEvaluator) {
        evaluatorCard.style.display = 'block';
    }

    // Show athlete card for non-committee members or always show it
    athleteCard.style.display = 'block';
}