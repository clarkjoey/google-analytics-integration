reprise.on("change_screen", (context) => { customJS(context, "change_screen") });
reprise.on("mount", (context) => { customJS(context, "mount") });

function sendGAEvent(demo_event, action, url, context) {
    reprise.post_message({
        gaEvent: demo_event,
        action: action,
        screen: context.screen.title,
        replay_title: context.replay_title,
        replay_id: context.replay_id,
        environment: context.environment,
        url: url,
        context: context
    });
}

function pollForReadyContext(context, action) {
    let attempts = 0;

    let interval = setInterval(() => {
        let ready =
            context &&
            context.replay_id &&
            context.screen &&
            context.screen.title &&
            context.replay_title;

        if (ready) {
            clearInterval(interval);
            console.log("Reprise CustomJS: GA Event posted from Demo");
            sendGAEvent('gtm_replay_page_view_ready', action, reprise.base_url, context);
            return;
        }

        if (attempts >= 10) {
            clearInterval(interval);
            console.warn("Reprise CustomJS: Gave up waiting for context readiness for GA post messsage");
        }

        attempts++;
    }, 25);
}

function customJS(context, action) {
    setTimeout(() => {
        pollForReadyContext(context, action);
    }, 1000);
}