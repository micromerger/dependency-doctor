exports.generateHTML = (packages, name) => {
	return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dependency Doctor Report</title>
    </head>
    <body>
        <div style="margin:0px auto; max-width:900px; background:#ffffff;">	
            <div style="padding-verticle:20px; justify-content: center; text-align: center;">
            <h1>${name} Depedency Report</h1>
            </div>		
            <table style="display: flex; justify-content: center; width: 100%;">
                <tr style="  background-color: #bcbcbc; padding-bottom: 2rem;">
                    <td style="font-weight: bold; padding:1rem;text-align: left; width:30%;">Package Name</td>
                    <td style="padding: 1rem;">Package Version</td>
                    <td style="padding: 1rem;">Latest Version</td>
                    <td style="padding: 1rem;">Update Status</td>
                    <td style="padding: 1rem;">Suppported/Deprecated</td>
                </tr>
                ${packages
					.map(
						package => `<tr style="background-color:${
							package.deprecated ? '#f00606' : '#f5f5f5'
						}; color: ${
							package.deprecated ? '#ffffff' : '#500050'
						};">
                            <td style="font-weight: bold; padding:1rem;text-align: left; width:30%;">${
								package.name
							}</td>
                            <td style="padding: 1rem;">${package.version}</td>
                            <td style="padding: 1rem;">${
								package.latestVersion
							}</td>
                            <td style="padding: 1rem; background-color:${
								package.updateStatus === 'Major Update'
									? '#fa9e9e'
									: package.updateStatus === 'Minor Update'
									? '#ffe599'
									: package.updateStatus === 'Patch Update'
									? '#fff2cc'
									: package.updateStatus === 'Latest Version'
									? '#cffabc'
									: '#f00606'
							};">${package.updateStatus}</td>
                            <td style="padding: 1rem;">${
								package.deprecated ? 'Deprecated' : 'Supported'
							}</td>
                        </tr>`
					)
					.join(' ')}
                <tr>
                        <td style="word-break:break-word;font-size:0px;padding:30px 0px">
                                <p style="font-size:1px;margin:0px auto;border-top:1px solid #dcddde;width:100%"></p>
                        </td>
                </tr>
                <tr>
                    <td style="word-break:break-word;font-size:0px;padding:0px" align="left">
                        <div style="color:#747f8d;font-family:Whitney,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;font-size:13px;line-height:16px;text-align:left">
                            <p>
                                This report is generated by <b>dependency-doctor</b>                                                                            
                            </p>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </body>
    </html>`;
};