import { ISetting, SettingType } from "@rocket.chat/apps-engine/definition/settings";

export enum AppSetting {
    SECRET_TOKEN = 'secret_token' 
}

export const settings: Array<ISetting> = [{
    id: AppSetting.SECRET_TOKEN,
    public: true,
    type: SettingType.STRING,
    required: true,
    packageValue: '',
    i18nPlaceholder: 'Generate and Paste your Secret Token here',
    value: '',
    i18nLabel: 'Secret Token',
    createdAt: new Date(),
    hidden: false,
    multiline: false,
    section: 'KEYS'
}]