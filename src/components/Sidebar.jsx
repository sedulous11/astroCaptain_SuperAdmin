import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { IoIosArrowDropleftCircle, IoMdHome } from "react-icons/io";
import { FaOm, FaAtom, FaJoomla, FaFire, FaBook } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdTempleHindu } from "react-icons/md";

export default function Sidebar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = () => {
    setOpen((prev) => !prev);
  };

  const navItems = [
    { icon: <IoMdHome className="size-6" />, label: "Home", path: "/" },
    { icon: <FaOm className="size-6" />, label: "Pandit", path: "/pandit" },
    {
      icon: <FaAtom className="size-6" />,
      label: "Astrologer",
      path: "/astrologer",
    },
    {
      icon: <FaJoomla className="size-6" />,
      label: "Astrocounsel",
      path: "/astrocounsel",
    },
    {
      icon: <FaFire className="size-6" />,
      label: "Pooja",
      path: "/pooja",
    },
    {
      icon: <MdTempleHindu className="size-6" />,
      label: "Temple",
      path: "/temple",
    },
    {
      icon: <FaBook className="size-5" />,
      label: "Bookings",
      path: "/bookings",
    },
  ];

  return (
    <Box
      sx={{
        width: open ? 200 : 60,
        transition: "width 0.3s",
        height: "100vh",
        bgcolor: "#121212",
        color: "#FFD700",
        display: "flex",
        flexDirection: "column",
        paddingTop: "16px",
        position: "relative",
      }}
    >
      <Box
        onClick={toggleDrawer}
        sx={{
          position: "absolute",
          top: -3,
          right: -13,
          zIndex: 10,
          transition: "transform 0.3s",
          transform: open ? "rotate(0deg)" : "rotate(180deg)",
          cursor:"pointer"
        }}
      >
        <IoIosArrowDropleftCircle className="size-10" />
      </Box>
      <List style={{ marginTop: 5 }}>
        {navItems.map((item, index) => (
          <ListItem
            key={index}
            disablePadding
            sx={{ justifyContent: open ? "flex-start" : "center" }}
          >
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                display: "flex",
                justifyContent: open ? "flex-start" : "center",
                gap: open ? 2 : 0,
                paddingLeft: open ? 2 : 1,
                paddingRight: open ? 2 : 1,
              }}
            >
              {item.icon}
              {open && <ListItemText primary={item.label} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
