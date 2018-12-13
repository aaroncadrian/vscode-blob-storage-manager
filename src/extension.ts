'use strict';
import * as vscode from 'vscode';
import pushToBlobStorage from './commands/push-to-blob-storage.command';

const { window } = vscode;

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "blob-storage-manager" is now active!');

    const channel = window.createOutputChannel('Blob Storage Manager');

    let disposable = vscode.commands.registerCommand('blobStorageManager.pushFileToBlobStorage', pushToBlobStorage(channel));
    context.subscriptions.push(disposable);
    context.subscriptions.push(channel);
}

export function deactivate() {
}