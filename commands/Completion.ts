import {
    IRead,
    IModify,
    IHttp,
    IPersistence,
    IModifyCreator,
    IMessageBuilder,
} from "@rocket.chat/apps-engine/definition/accessors";
import { IMessage } from "@rocket.chat/apps-engine/definition/messages";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import {
    ISlashCommand,
    SlashCommandContext,
} from "@rocket.chat/apps-engine/definition/slashcommands";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { AppSetting } from "../config/Settings";
import { TextObjectType } from "@rocket.chat/apps-engine/definition/uikit";
import { BlockElementType } from "@rocket.chat/apps-engine/definition/uikit";
import { ButtonStyle } from "@rocket.chat/apps-engine/definition/uikit";

export class CompletionCommand implements ISlashCommand {
    public command: string = "completion";
    public i18nDescription: string = "Generates a predictive Completion";
    public i18nParamsExample: string = "";
    public providesPreview: boolean = false;

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence
    ): Promise<void> {
        // need three info: messageBuilder, user/sender and room in which we need to create the message
        const creator: IModifyCreator = modify.getCreator();

        const room: IRoom = context.getRoom();
        const sender: IUser = (await read
            .getUserReader()
            .getAppUser()) as IUser;

        const parameter = context.getArguments()[0];

        const { value: Secret } = await read
            .getEnvironmentReader()
            .getSettings()
            .getById(AppSetting.SECRET_TOKEN);

        const completion = await http.post(
            "https://api.openai.com/v1/completions",
            {
                data: {
                    model: "text-davinci-002",
                    prompt: parameter,
                    temperature: 0,
                    max_tokens: 64,
                    top_p: 1.0,
                    frequency_penalty: 0.0,
                    presence_penalty: 0.0,
                },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer"
                },
            }
        );

        const text = completion.data.choices[0].text.trim();

        const block = creator.getBlockBuilder();

        block.addSectionBlock({
            text: {
                type: TextObjectType.MARKDOWN,
                text: `\`\`\`${text} \`\`\``,
            },
        });

        block.addActionsBlock({
            elements: [
                block.newButtonElement({
                    text: {
                        type: TextObjectType.PLAINTEXT,
                        text: "Submit",
                    },
                    value: "Submit",
                    url: "https://google.com",
                    style: ButtonStyle.PRIMARY,
                }),
            ],
        });

        
        const message = creator
            .startMessage()
            .setSender(sender)
            .setRoom(room)
            .setBlocks(block);

        await creator.finish(message);
    }
}
