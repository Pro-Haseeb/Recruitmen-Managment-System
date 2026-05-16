import React from "react";
import Joyride from "react-joyride";

export default function TutorialGuide() {
  const steps = [
    {
      target: "#jobs-btn",
      content: "Yahan click karne se jobs open hongi.",
      disableBeacon: true,
    },
    {
      target: "#demo-btn",
      content: "Yahan se demo request bheji ja sakti hai.",
    },
  ];

  return (
    <Joyride
      steps={steps}
      run={true}
      continuous={true}
      showSkipButton={true}
      showProgress={true}
      styles={{
        options: {
          primaryColor: "#1976d2",
          zIndex: 10000,
        },
      }}
    />
  );
}