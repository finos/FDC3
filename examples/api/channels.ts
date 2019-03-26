const fdc3: DesktopAgent;

async function channelExamples() {
    
    // ['blue', 'purple', 'green']
    const allChannels = await fdc3.channels.list();

    await fdc3.channels.update('blue', {
        type: 'fdc3.contact',
        name: 'Riko Eksteen',
        id: {
            email: 'riko@weareadaptive.com'
        }
    });

    // called every time fdc3.contact type is updated on the blue channel
    const contactListener = fdc3.channels.watch('blue', 'fdc3.contact', contact => {
        console.log("Selected contact is" + contact.name);
    });

    contactListener.unsubscribe();
};