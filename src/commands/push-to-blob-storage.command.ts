import { window, OutputChannel, workspace } from 'vscode';
import { createBlobService } from 'azure-storage'
import * as path from 'path';

export function getConfiguration<T>(section: string): T | undefined {
    return workspace.getConfiguration('blobStorageManager').get<T | undefined>(section);
}

export function getConnectionString(): string | undefined {
    return getConfiguration('connectionString');
}

export function getContainer(): string | undefined {
    return getConfiguration('container');
}

export default function pushToBlobStorage(channel: OutputChannel) {
    return function(): void {
        const editor = window.activeTextEditor;
    
        if(!editor) {
            return;
        }

        const connectionString = getConnectionString();
        const container = getContainer();

        if(!connectionString || !container)
        {
            return;
        }
    
        const service = createBlobService(connectionString);
    
        const localFileName = editor.document.fileName;
        const fileName = path.basename(localFileName);
    
        channel.show();
        channel.appendLine(`Uploading ${fileName} to ${container} in blob storage...`);
    
        service.createBlockBlobFromLocalFile(container, fileName, localFileName, (err, result, response) => {
            if(err) {
                channel.appendLine(`Error uploading ${fileName}...`)
                channel.appendLine(`${err}`);
                channel.appendLine('');
                console.log(err);
                return;
            }
    
            const successMessage = `\`${fileName}\` successfully uploaded to \`${container}.\``;
    
            channel.appendLine(successMessage);
    
            window.showInformationMessage(successMessage);
            
            console.log('result', result);
            console.log('response', response);
    
            channel.appendLine('');
        });
    }
}