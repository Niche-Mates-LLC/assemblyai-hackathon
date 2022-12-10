import type {
  ClientConfig,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-react";
import {
  AgoraVideoPlayer,
  createClient,
  createMicrophoneAndCameraTracks,
} from "agora-rtc-react";
import { useState, useEffect } from "react";

export default function Call({ channelName = "call" }) {
  const config = { mode: "rtc", codec: "vp8" };

  const useClient = createClient(config as ClientConfig);
  const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();

  const [users, setUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [start, setStart] = useState<boolean>(false);

  useEffect(() => {
    // function to initialise the SDK
    let init = async (name: string) => {
      console.log("init", name);
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        console.log("subscribe success");
        if (mediaType === "video") {
          setUsers((prevUsers) => {
            return [...prevUsers, user];
          });
        }
        if (mediaType === "audio") {
          user.audioTrack?.play();
        }
      });

      client.on("user-unpublished", (user, type) => {
        console.log("unpublished", user, type);
        if (type === "audio") {
          user.audioTrack?.stop();
        }
        if (type === "video") {
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
          });
        }
      });

      client.on("user-left", (user) => {
        console.log("leaving", user);
        setUsers((prevUsers) => {
          return prevUsers.filter((User) => User.uid !== user.uid);
        });
      });

      await client.join(
        "7d83f415c4014ef0ac6b54caad9a5160",
        name,
        "007eJxTYKgT1JN2MK2bd/78+8rn9cvf3Nh0u2zBjP1/ntgt0egPb+VTYDBPsTBOMzE0TTYxMDRJTTNITDZLMjVJTkxMsUw0NTQzqO2ZktwQyMjwt7OekZEBAkF8FobkxJwcBgYA+XAiDQ==",
        null
      );
      if (tracks) {
        await client.publish([tracks[0], tracks[1]]);
      }
      setStart(true);
    };

    if (ready && tracks && !start) {
      console.log("init ready");
      init("call");
    }
  }, [client, start, ready, tracks]);

  return start && tracks && <Videos users={users} tracks={tracks} />;
}

const Videos = (props: {
  users: IAgoraRTCRemoteUser[];
  tracks: [IMicrophoneAudioTrack, ICameraVideoTrack];
}) => {
  const { users, tracks } = props;

  return (
    <div id="videos">
      <AgoraVideoPlayer
        className="min-h-[400px] min-w-[400px]"
        videoTrack={tracks[1]}
      />
      {users.length > 0 &&
        users.map((user) => {
          if (user.videoTrack) {
            return (
              <AgoraVideoPlayer
                className="min-h-[400px] min-w-[400px]"
                videoTrack={user.videoTrack}
                key={user.uid}
              />
            );
          } else {
            return null;
          }
        })}
    </div>
  );
};
