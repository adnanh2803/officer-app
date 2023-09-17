const {header, footer} = require('../generic/generic-sections')

function assetList(assets){
    return assets.map((asset) =>{
        return (`<li>${asset.Name}</li>`)
    }).join('\n')
}

exports.assetAgreement = function(user, company, agreement, assets, reviewers, title, foot){
    return `
    <div>
        ${header(title)}
        <div>
            <div style="text-align:center;">
            <p>
            <b>${company.Name},</b> ${company.Address},
            OIB: ${company.OIB}, (u daljnjem tekstu Poslodavac)
            </p></br>
            <p>i</p></br>
            <p>
            <b>${user.FullName}</b> iz ${user.Address}, OIB: ${user.OIB}
            (u daljenjm tekstu Radnik)
            </p><br/>
            <p>
            su u <b>Puli</b> dana ${agreement.Date} zaključili slijedeće
            </p></br>
            <p>
                <b>Potvrda o zaduženju opreme</b>
            </p>
            </div>
            <p>Radik je primio opremu sa sljedećim specifikacijama</p></br>
            <ol>
             ${assetList(assets)}
            </ol>
            <br><br><br><br>
            <div style="margin-left:10px;">
            ${reviewers.map((reviewer)=>{
                return `<div style="margin-bottom:48px; width: 148px;"><hr><p style="margin:0;"><b>${reviewer.FullName}</b></p><p style="color:grey;font-size:10px;margin:0;">${reviewer.Position}</p></div>`
            }).join("\n")}
            </div>            
        </div>
        ${footer(foot)}
    </div>
    `
}