import { Card, CardContent, Typography, Box } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

export default function StatsCard({
  title,
  value,
  icon,
  color,
  trend,
  percent
}) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="body2">{title}</Typography>
            <Typography variant="h5">{value}</Typography>
          </Box>

          <Box
            sx={{
              background: color,
              color: "white",
              p: 1,
              borderRadius: 2
            }}
          >
            {icon}
          </Box>
        </Box>

        <Box display="flex" alignItems="center" mt={2}>
          {trend === "up" ? <TrendingUpIcon /> : <TrendingDownIcon />}
          <Typography ml={1}>{percent}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}