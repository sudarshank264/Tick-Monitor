import { LineWave, Triangle } from "react-loader-spinner";
import { TypeAnimation } from "react-type-animation";

const LoginLoader = ({ loading }: { loading: boolean }) => {
  return (
    <div className="w-full h-screen bg-white flex justify-end">
      <div className="animate-login-loader-grow justify-self-start flex items-center justify-center">
        <div className="animate-login-loader-appear">
          <Triangle height={130} width={130} color="#0f172a" />
        </div>
      </div>
      <div className="bg-slate-900 animate-login-bg-shrink flex items-center justify-center text-white">
        <TypeAnimation
          style={{ fontSize: 45, fontWeight: "bold" }}
          sequence={[
            "T",
            150,
            "Ti",
            50,
            "Tic",
            50,
            "Tick",
            130,
            "TickM",
            500,
            "TickMo",
            100,
            "TickMon",
            200,
            "TickMoni",
            100,
            "TickMonit",
            200,
            "TickMonito",
            100,
            "TickMonitor",
          ]}
        />
      </div>
    </div>
  );
};

export default LoginLoader;
