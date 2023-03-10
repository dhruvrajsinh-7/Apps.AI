import {
    IAppAccessors,
    IConfigurationExtend,
    IEnvironmentRead,
    ILogger,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { CompletionCommand } from './commands/Completion';
import { settings } from './config/Settings';

export class AppsAiApp extends App {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    protected async extendConfiguration(configuration: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {

        await Promise.all(settings.map((setting) => {
            configuration.settings.provideSetting(setting);
        }))

        const completionCommand: CompletionCommand = new CompletionCommand();
        configuration.slashCommands.provideSlashCommand(completionCommand);
    }
}
