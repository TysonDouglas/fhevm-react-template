// Mock Ethers.js for testing UI
window.ethers = {
    providers: {
        Web3Provider: function(provider) {
            this.getSigner = function() {
                return {
                    getAddress: function() {
                        return Promise.resolve("0x742d35Cc6C6C75532e36D4bC8ee2b47e4A4DD344");
                    }
                };
            };
            return this;
        }
    },
    Contract: function(address, abi, signer) {
        this.selectionCommittee = function() {
            return Promise.resolve("0x742d35Cc6C6C75532e36D4bC8ee2b47e4A4DD344");
        };
        this.currentSelectionId = function() {
            return Promise.resolve(1);
        };
        this.authorizedEvaluators = function(address) {
            return Promise.resolve(false);
        };
        this.getSelectionInfo = function(id) {
            return Promise.resolve({
                sportCategory: "Swimming",
                isActive: true,
                isCompleted: false,
                startTime: Math.floor(Date.now() / 1000),
                endTime: Math.floor(Date.now() / 1000) + 86400,
                registeredCount: 5,
                selectedCount: 0,
                maxSelections: 10
            });
        };
        this.getCurrentSelectionDeadlines = function() {
            return Promise.resolve({
                registrationEnd: Math.floor(Date.now() / 1000) + 86400,
                evaluationEnd: Math.floor(Date.now() / 1000) + 86400 * 2
            });
        };
        this.isAthleteRegistered = function(id, address) {
            return Promise.resolve(false);
        };
        this.isAthleteEvaluated = function(id, address) {
            return Promise.resolve(false);
        };
        this.startNewSelection = function(...args) {
            return Promise.resolve({
                wait: function() {
                    return Promise.resolve();
                }
            });
        };
        this.registerAthlete = function(...args) {
            return Promise.resolve({
                wait: function() {
                    return Promise.resolve();
                }
            });
        };
        this.addAuthorizedEvaluator = function(address) {
            return Promise.resolve({
                wait: function() {
                    return Promise.resolve();
                }
            });
        };
        this.removeAuthorizedEvaluator = function(address) {
            return Promise.resolve({
                wait: function() {
                    return Promise.resolve();
                }
            });
        };
        this.finalizeSelection = function() {
            return Promise.resolve({
                wait: function() {
                    return Promise.resolve();
                }
            });
        };
        this.evaluateAthlete = function(address) {
            return Promise.resolve({
                wait: function() {
                    return Promise.resolve();
                }
            });
        };
        return this;
    },
    utils: {
        isAddress: function(address) {
            return address && address.startsWith('0x') && address.length === 42;
        }
    }
};

// Mock MetaMask
window.ethereum = {
    request: function(params) {
        if (params.method === 'eth_accounts') {
            return Promise.resolve(["0x742d35Cc6C6C75532e36D4bC8ee2b47e4A4DD344"]);
        }
        if (params.method === 'eth_requestAccounts') {
            return Promise.resolve(["0x742d35Cc6C6C75532e36D4bC8ee2b47e4A4DD344"]);
        }
        return Promise.resolve();
    },
    on: function(event, callback) {
        // Mock event listeners
    }
};

console.log('Mock ethers and MetaMask loaded');