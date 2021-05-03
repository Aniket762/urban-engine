const vscode = require('vscode');
const axios = require('axios');
const xmlParser = require('fast-xml-parser');


/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
	const res = await axios.get("https://medium.com/feed/@itzaniket762")
	const articles = xmlParser.parse(res.data).rss.channel.item.map(
		article =>
		{
			return {
				label: article.title,
				detail: article.description,
				link:article.link
			}
		}
	)
	console.log(articles);
	
	let disposable = vscode.commands.registerCommand('urban-engine.searchBlog',
		async function ()
		{
		const article = await vscode.window.showQuickPick(articles, {
			matchOnDetail:true
		})
			
		if(article == null) return 
			
		vscode.env.openExternal(article.link)
			
		console.log(article)
	});

	context.subscriptions.push(disposable);
}


function deactivate() {}

module.exports = {
	activate,
	deactivate
}
