import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
} from "@mui/material";
import {
  FaCalendarAlt,
  FaUserPlus,
  FaTasks,
  FaCog,
  FaBell,
} from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";

const theme = createTheme({
  palette: {
    primary: {
      main: "#5E9ED9",
    },
    secondary: {
      main: "#FFFFFF",
    },
  },
});

const TherapistDashboard = () => {
  const handleViewDetails = () => {
    alert("Redirecting to patient details...");
  };

  const handleViewAppointments = () => {
    alert("Redirecting to view appointments...");
  };

  const handleNewPatientRequests = () => {
    alert("Redirecting to new patient requests...");
  };

  const handleManageScheduling = () => {
    alert("Redirecting to manage scheduling...");
  };

  const handleSettings = () => {
    alert("Redirecting to settings...");
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", bgcolor: "grey.100" }}>
        {/* Header */}
        <Box
          component="header"
          sx={{
            bgcolor: "primary.main",
            color: "white",
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Welcome, [Therapist's Name]
          </Typography>
          <Stack direction="row" spacing={2}>
            <IconButton color="secondary" onClick={() => alert("Notifications")}>
              <FaBell />
            </IconButton>
            <IconButton color="secondary" onClick={handleSettings}>
              <FaCog />
            </IconButton>
            <IconButton color="secondary" onClick={() => alert("Profile")}>
              <BsPersonCircle />
            </IconButton>
          </Stack>
        </Box>

        {/* Main Content */}
        <Box sx={{ p: 4 }}>
          <Grid container spacing={4}>
            {/* Left Section - Patients */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="primary.main"
                    mb={2}
                  >
                    Patients
                  </Typography>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid #E0E0E0",
                      }}
                    >
                      <Typography variant="body1">
                        Patient: FirstName LastName
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleViewDetails}
                      >
                        View Details
                      </Button>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>

            {/* Right Section - Quick Actions */}
            <Grid item xs={12} md={4}>
              <Stack spacing={2}>
                {[
                  {
                    label: "View Appointments",
                    icon: <FaCalendarAlt />,
                    action: handleViewAppointments,
                  },
                  {
                    label: "New Patient Requests",
                    icon: <FaUserPlus />,
                    action: handleNewPatientRequests,
                  },
                  {
                    label: "Manage Scheduling",
                    icon: <FaTasks />,
                    action: handleManageScheduling,
                  },
                ].map((item, index) => (
                  <Button
                    key={index}
                    variant="contained"
                    color="primary"
                    startIcon={item.icon}
                    onClick={item.action}
                    fullWidth
                    sx={{
                      justifyContent: "space-between",
                      bgcolor: "blue.50",
                      color: "primary.main",
                      "&:hover": {
                        bgcolor: "blue.100",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            bgcolor: "primary.main",
            color: "white",
            textAlign: "center",
            p: 2,
          }}
        >
          <Typography>&copy; 2024 Peace of Mind. All rights reserved.</Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default TherapistDashboard;
