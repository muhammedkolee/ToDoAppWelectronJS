module.exports = {
    makers: [
        {
            name: '@electron-forge/maker-wix',
            config: {
                language: 1033,
                manufacturer: 'Deneme Company',
                wixConfig: {
                    codepage: "65001"
                },
                ui: {
                    chooseDirectory: true
                }
            }
        }
    ],
};

