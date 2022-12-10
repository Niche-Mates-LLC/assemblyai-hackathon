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
import { useState, useEffect, useCallback, useRef } from "react";
import RecordRTC, { invokeSaveAsDialog, StereoAudioRecorder } from "recordrtc";

const appId = "7d83f415c4014ef0ac6b54caad9a5160";
const token =
  "007eJxTYKgT1JN2MK2bd/78+8rn9cvf3Nh0u2zBjP1/ntgt0egPb+VTYDBPsTBOMzE0TTYxMDRJTTNITDZLMjVJTkxMsUw0NTQzqO2ZktwQyMjwt7OekZEBAkF8FobkxJwcBgYA+XAiDQ==";

export default function Call({ channelName = "call" }) {
  const config = { mode: "rtc", codec: "vp8" };

  const useClient = createClient(config as ClientConfig);
  const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();

  const [users, setUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [start, setStart] = useState<boolean>(false);
  const [message, setMessage] = useState<string>();
  const recorder = useRef<any>();
  const socket = useRef<WebSocket>();

  const startRecording = useCallback(async (stream?: MediaStream) => {
    if (!stream) {
      return;
    }

    recorder.current = new RecordRTC(stream, {
      type: "audio",
      mimeType: "audio/webm;codecs=pcm", // endpoint requires 16bit PCM audio
      recorderType: StereoAudioRecorder,
      timeSlice: 500, // set 250 ms intervals of data that sends to AAI
      desiredSampRate: 16000,
      numberOfAudioChannels: 1, // real-time requires only one channel
      bufferSize: 4096,
      audioBitsPerSecond: 128000,
      ondataavailable: (blob: Blob) => {
        // console.log(`Received blob ${blob.size}`);

        const reader = new FileReader();
        reader.onload = () => {
          const base64data = reader.result as string;

          // audio data must be sent as a base64 encoded string
          if (socket) {
            socket.current?.send(
              JSON.stringify({ audio_data: base64data?.split("base64,")[1] })
            );
          }
        };
        reader.readAsDataURL(blob);
      },
    });

    const { token } = await (await fetch("/api/token")).json();
    socket.current = await new WebSocket(
      `wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`
    );
    socket.current.onopen = () => recorder.current?.startRecording();

    const texts: any = {};
    socket.current.onmessage = (message) => {
      let msg = "";
      const res = JSON.parse(message.data);
      texts[res.audio_start] = res.text;
      const keys = Object.keys(texts);
      keys.sort((a: any, b: any) => a - b);
      for (const key of keys) {
        if (texts[key]) {
          msg += ` ${texts[key]}`;
        }
      }
      // console.log(message.data);
      // console.log(msg);
      setMessage(msg);
    };

    socket.current.onerror = (event) => {
      console.error(event);
      socket.current?.send(JSON.stringify({ terminate_session: true }));
      socket.current?.close();
    };

    socket.current.onclose = (event) => {
      console.log(event);
      socket.current?.send(JSON.stringify({ terminate_session: true }));
      socket.current = undefined;
    };
    // take the stream and start recording it to a file
  }, []);

  useEffect(() => {
    // function to initialise the SDK
    let init = async (name: string) => {
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "video") {
          setUsers((prevUsers) => {
            return [...prevUsers, user];
          });
        }
        if (mediaType === "audio") {
          user.audioTrack?.play();
          if (user.audioTrack) {
            // startRecording(
            //   new MediaStream([user.audioTrack.getMediaStreamTrack()])
            // );
          }
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
        setUsers((prevUsers) => {
          return prevUsers.filter((User) => User.uid !== user.uid);
        });
      });

      await client.join(appId, name, token, null);
      if (tracks) {
        await client.publish([tracks[0], tracks[1]]);
        setStart(true);
        startRecording(new MediaStream([tracks[0].getMediaStreamTrack()]));
      }
    };

    if (ready && tracks && !start) {
      init("call");
    }
  }, [client, start, ready, tracks, startRecording]);

  return (
    start &&
    tracks && (
      <>
        <p>{message}</p>
        <Videos users={users} tracks={tracks} />
      </>
    )
  );
}

const Videos = (props: {
  users: IAgoraRTCRemoteUser[];
  tracks: [IMicrophoneAudioTrack, ICameraVideoTrack];
}) => {
  const { users, tracks } = props;

  return (
    <div id="videos" className="relative">
      <div className="absolute bottom-2 right-[420px] z-20 h-[120px] w-[160px] rounded-lg">
        <AgoraVideoPlayer
          className="h-[120px] w-[160px]"
          videoTrack={tracks[1]}
        />
      </div>
      {users.length > 0 &&
        users.map((user) => {
          if (user.videoTrack) {
            return (
              <AgoraVideoPlayer
                style={{
                  width: `${window.innerWidth - 450}px`,
                  height: `${window.innerHeight - 65}px`,
                }}
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
