import '../../static/styles.css';
import { useEffect, useState } from 'react';
import { getAgent } from '@finos/fdc3-get-agent';
import { DesktopAgent, Listener } from '@finos/fdc3';
import { createRoot } from 'react-dom/client';
import styles from './main.module.css';

export const ReceiveComponent = () => {
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [currentChannel, setCurrentChannel] = useState<string | null>(null);
  const [theListener, setTheListener] = useState<Listener | null>(null);

  useEffect(() => {
    console.log('starting...');
    getAgent().then(agent => {
      agent.addEventListener('userChannelChanged', async () => {
        console.log('userChannelChanged');
        setLogMessages(prev => [...prev, 'User channel changed']);
        const channel = await agent.getCurrentChannel();
        setCurrentChannel(channel?.id || null);

        if (theListener != null) {
          await theListener!.unsubscribe();
        }

        const listener = await channel?.addContextListener(null, context => {
          console.log('RECEIVED CONTEXT', context);
          setLogMessages(prev => [...prev, 'Received: ' + JSON.stringify(context)]);
        });
        setTheListener(listener || null);
      });

      const channel = agent.getCurrentChannel().then(async channel => {
        setCurrentChannel(channel?.id || null);
        const listener = await channel?.addContextListener(null, context => {
          console.log('RECEIVED CONTEXT', context);
          setLogMessages(prev => [...prev, 'Received: ' + JSON.stringify(context)]);
        });
        setTheListener(listener || null);
      });
    });
  }, []);

  return (
    <div className={styles.receiveComponent}>
      <h2>Receive Component</h2>
      <div className={styles.channelInfo}>Current channel: {currentChannel}</div>
      <div id="log" className={styles.receiveLog}>
        {logMessages.map((msg, index) => (
          <p className={styles.message} key={index}>
            {msg}
          </p>
        ))}
      </div>
    </div>
  );
};

const container = document.getElementById('app');
const root = createRoot(container!);

root.render(<ReceiveComponent />);
