import '../../static/styles.css';
import { useEffect, useState } from 'react';
import { Channel, DesktopAgent, FDC3ChannelChangedEvent } from '@finos/fdc3';
import { getAgent } from '@finos/fdc3-get-agent';
import { createRoot } from 'react-dom/client';
import styles from './main.module.css';

function createContext(i: number) {
  return {
    type: 'demo.counter',
    count: i,
    name: 'Counter ' + i,
  };
}

export const BroadcastComponent = () => {
  const [fdc3, setFdc3] = useState<DesktopAgent | null>(null);
  const [currentChannel, setCurrentChannel] = useState<string | null>(null);
  const [channelList, setChannelList] = useState<Channel[]>([]);

  useEffect(() => {
    console.log('starting...');
    getAgent().then(agent => {
      console.log('got api...');
      setFdc3(agent);
      refreshChannels(agent);
      agent.addEventListener('userChannelChanged', e => {
        const { currentChannelId } = (e as FDC3ChannelChangedEvent).details;
        setCurrentChannel(currentChannelId);
        void refreshChannels(agent);
      });
    });
  }, []);

  const refreshChannels = async (fdc3: DesktopAgent) => {
    const channels = await fdc3.getUserChannels();
    setChannelList(channels);
    const channel = await fdc3.getCurrentChannel();
    console.log('current channel', channel);
    setCurrentChannel(channel?.id ?? null);
  };

  const broadcastContexts = async () => {
    if (!fdc3) return;

    const cc = await fdc3.getCurrentChannel();
    if (cc != null) {
      for (let index = 0; index < 5; index++) {
        setTimeout(() => cc.broadcast(createContext(index)), index * 1000);
      }
    }
  };

  return (
    <div className={styles.broadcastComponent}>
      <h2>Broadcast Component</h2>
      <p>Note: must be connected to a user channel to broadcast.</p>
      <div className={styles.channelList}>
        {channelList.map(channel => (
          <div
            key={channel.id}
            className={styles.channelItem}
            style={channel.id == currentChannel ? { backgroundColor: 'green' } : {}}
          >
            {channel.id}
          </div>
        ))}
      </div>
      <button className={styles.broadcast} onClick={broadcastContexts}>
        Broadcast Contexts
      </button>
    </div>
  );
};

const container = document.getElementById('app');
const root = createRoot(container!);

root.render(<BroadcastComponent />);
