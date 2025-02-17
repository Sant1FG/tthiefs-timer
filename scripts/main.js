var combatStart;
var combatEnd;

Hooks.on("combatStart", (combat, updates) => {
    combatStart = new Date();
    var hour = combatStart.getHours();
    var min = (combatStart.getMinutes() < 10 ? '0' : '') + combatStart.getMinutes();  

    let content = `<div class="timer-msg">The combat has started at ${hour}:${min} </div>`;

    const speaker = ChatMessage._getSpeakerFromUser({ user: game.user });

    let messageData = {
        user: game.user.id,
        speaker: speaker,
        type: CONST.CHAT_MESSAGE_STYLES.OOC,
        content: content
        }
        if(game.user.isGM){
    ChatMessage.create(messageData);
        }
});


Hooks.on("deleteCombat", (combat, updates) => {
    combatEnd = new Date();
    var hour = combatEnd.getHours();
    var min = (combatEnd.getMinutes() < 10 ? '0' : '') + combatEnd.getMinutes(); 
    var combatTime = diff_minutes(combatStart, combatEnd);

    let content = `<div class="timer-msg">The combat has ended at ${hour}:${min} after ${combatTime} minutes </div>`;

    const speaker = ChatMessage._getSpeakerFromUser({ user: game.user });

    let messageData = {
        user: game.user.id,
        speaker: speaker,
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