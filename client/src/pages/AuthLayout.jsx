import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const images = [
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
  "https://images.unsplash.com/photo-1552664730-d307ca884978"
];

const AuthLayout = ({ children }) => {

  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {

    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);

  }, []);

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
      }}
    >

      {/* LEFT */}
      <Box
        sx={{
          width: "50%",
          position: "relative",
          backgroundImage: `url(${images[imageIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(0,0,0,0.75), rgba(0,150,255,0.6))"
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            color: "white",
            textAlign: "center"
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Hire smarter with
          </Typography>

          <Typography
            variant="h2"
            fontWeight="bold"
            color="#00e5ff"
          >
            AI Intelligence
          </Typography>

        </Box>
      </Box>

      {/* RIGHT */}
      <Box
        sx={{
          width: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f4f7fb"
        }}
      >
        {children}
      </Box>

    </Box>
  );
};

export default AuthLayout;