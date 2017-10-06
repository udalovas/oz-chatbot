require('./connectorSetup.js')();

var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.send("Welcome to the Land of Oz.");
        session.beginDialog('dialogs.root.options');
    },
    function (session, results) {
        session.endConversation(`See you later!`);
    }
])
    .endConversationAction("actions.end", "Ok. Goodbye.", {
        matches: /^cancel$|^goodbye$|^bye$/i,
        confirmPrompt: "This will return you from magic world of Oz back to reality. Are you sure?"
    });

var SERVICE_OPTIONS = {
    "Get Brain": {
        id: "dialogs.brain"
    },
    "Get Heart": {
        id: "dialogs.heart"
    },
    "Get back to Home": {
        id: "dialogs.home"
    },
}

bot.dialog('dialogs.root.options', [
    function (session) {
        builder.Prompts.choice(session, "How can I help you?", SERVICE_OPTIONS, { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        session.beginDialog(SERVICE_OPTIONS[results.response.entity].id);
    }
]);

bot.dialog('dialogs.heart', [
    function (session) {
        session.send('Glad to see you on the way to a better Heart.');
        builder.Prompts.text(session, "Any details you can provide us about your request?");
    },
    function (session, results) {
        session.dialogData.details = results.response;
        session.send('Processing...');
        // some processing logic might be here..
        session.send(`Here is what I can advice you based on details you provided (\'${session.dialogData.details}\'): ... that will give you a better Heart!`);
        session.endDialog();
    }
])
    .beginDialogAction('actions.heart.help', 'dialogs.heart.help', {
        matches: /^help$/i
    });

bot.dialog('dialogs.heart.help', function (session, args, next) {
    var msg = "A Heart flow HELP goes here...";
    session.endDialog(msg);
});

bot.dialog('dialogs.home', [
    function (session) {
        session.send('Ok, I\'ll book you a Baloon for this purpose, please wait, your Home is closer than you might imagine.');
        session.endDialog();
    }
]);

bot.dialog('dialogs.brain', [
    function (session) {
        session.send(`No better Brains than you have, you are good enough.`);
        session.endDialog();
    }
])
    .triggerAction({
        matches: /^get brain$/i,
        confirmPrompt: "Are you sure? New Brain? Seriously?"
    });

/**
 * Global Actions/Dialogs
 */
bot.dialog('dialogs.help', function (session, args, next) {
    var msg = "A global HELP goes here...";
    session.endDialog(msg);
})
    .triggerAction({
        matches: /^help$/i
    });