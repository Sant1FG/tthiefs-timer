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

Hooks.on("updateCombatant", async function (combatant, updateData, options, userId) {

  if (!game.user.isGM) return;
    
  // Only apply on active combat and owned tokens
  const token = combatant.token;
  if (!token || !token.actor || token.actor.type === "character") return;

  // Only continue if this user has permission to update this token
  if (!token.isOwner) return;

   // Only proceed if defeated flag is changing
  if (!("defeated" in updateData)) return;

  const isNowDefeated = updateData.defeated === true;
  const newAlpha = isNowDefeated ? 0.3 : 1.0;

  try {
    await token.update({ alpha: newAlpha });
  } catch (err) {
    console.warn(`Failed to update alpha on token ${token.name}:`, err);
  }
});

Hooks.on("deleteCombat", async function (combat) {
  // Ensure this only runs once and only by GMs
  if (!game.user.isGM) return;

  // Iterate through all tokens on the canvas
  for (const token of canvas.tokens.placeables) {
    const doc = token.document;

    // Only reset tokens that are NPCs and not at full opacity
    if (doc.actor?.type !== "character" && doc.alpha < 1.0) {
      try {
        await doc.update({ alpha: 1.0 });
      } catch (err) {
        console.warn(`Failed to restore opacity for token ${doc.name}:`, err);
      }
    }
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