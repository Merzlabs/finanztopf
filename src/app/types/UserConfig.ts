export class UserConfig {
    onboardingDone: boolean;
    ignoreCreditor: string;
    ignoreIBAN: string;
    darkMode: boolean;
    userCategories: string;
    owner: string;

    constructor() {
        this.onboardingDone = localStorage.getItem('onboardingDone') === 'true';
        this.darkMode = localStorage.getItem('darkMode') === 'true';
        this.userCategories = localStorage.getItem('userCategories');
        this.ignoreCreditor = localStorage.getItem('ignoreCreditor');
        this.ignoreIBAN = localStorage.getItem('ignoreIBAN');
    }
}
