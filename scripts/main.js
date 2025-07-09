var combatStart;
var combatEnd;



Hooks.on("combatStart", (combat, updates) => {
    combatStart = new Date();
    var hour = combatStart.getHours();
    var min = (combatStart.getMinutes() < 10 ? '0' : '') + combatStart.getMinutes();  

    let content = `<div class="timer-msg">The combat has started at ${hour}:${min} </div>`;

    let messageData = {
        user: game.user.id,
        type: CONST.CHAT_MESSAGE_STYLES.OOC,
        content: content
        }
        if(game.user.isGM){
    ChatMessage.create(messageData);
        }
});

Hooks.on("updateCombatant", async function (combatant, data, options) {
    let token = combatant.token;
    if (game.combats.active && token.combatant.isDefeated && token.actor?.type !== 'character') {
        Sequencer.EffectManager.endEffects({ object: token });
        token.update({ alpha: 0.3 });
    }

    if (game.combats.active && token.combatant.isDefeated && token.combatant.defeated == false && token.actor?.type !== 'character') {
        token.update({ alpha: 1.0 });
    }


});

Hooks.on("deleteCombat", async function (combat) {
    if (!game.combats.active) {
        canvas.tokens.placeables.forEach(token => {
            let each = token.document;
            if(each.alpha < 1 ){
                each.update({ alpha: 1.0 });
            }
            
        });
    }
});


Hooks.on("deleteCombat", (combat, updates) => {
    combatEnd = new Date();
    var hour = combatEnd.getHours();
    var min = (combatEnd.getMinutes() < 10 ? '0' : '') + combatEnd.getMinutes(); 
    var combatTime = diff_minutes(combatStart, combatEnd);

    let content = `<div class="timer-msg">The combat has ended at ${hour}:${min} after ${combatTime} minutes </div>`;

    let messageData = {
        user: game.user.id,
        type: CONST.CHAT_MESSAGE_STYLES.OOC,
        content: content
        }

    if(game.user.isGM){
        ChatMessage.create(messageData);
    }    
    
});


function diff_minutes(dt2, dt1) 
 {
  // Calculate the difference in milliseconds between the two provided dates and convert it to seconds
  var diff =(new Date(dt2).getTime() - new Date(dt1).getTime()) / 1000;
  // Convert the difference from seconds to minutes
  diff /= 60;
  // Return the absolute value of the rounded difference in minutes
  return Math.abs(Math.round(diff));
 }