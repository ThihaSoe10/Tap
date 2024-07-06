import { Button, Box, Typography, Modal, Snackbar } from "@mui/material";
import UpgradeState from "../classes/upgradeState";
import React, { useEffect, useRef } from "react";
import UpgradeEnergy from "../classes/upgradeEnergy";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "rgb(14, 16, 17)",
  border: "2px solid rgb(141, 130, 114)",
  boxShadow: 24,
  p: 3,
};

export function SaveGame(props: {
  balanceRef: React.MutableRefObject<{ value: number }>;
  upgradeMap: React.MutableRefObject<Map<string, UpgradeState>>;
  upgradeEnergyMap: React.MutableRefObject<Map<string, UpgradeEnergy>>;
}) {
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  function handleSave() {
    localStorage.setItem(
      "balanceRef",
      JSON.stringify(props.balanceRef.current.value)
    );
    localStorage.setItem(
      "Upgradeclick",
      JSON.stringify(props.upgradeMap.current.get("clickUpgrade")!.level)
    );
    localStorage.setItem(
      "AC1Level",
      JSON.stringify(props.upgradeMap.current.get("autoClicker01")!.level)
    );
    localStorage.setItem(
      "AC2Level",
      JSON.stringify(props.upgradeMap.current.get("autoClicker02")!.level)
    );
    localStorage.setItem(
      "AC3Level",
      JSON.stringify(props.upgradeMap.current.get("autoClicker03")!.level)
    );
    localStorage.setItem(
      "AC4Level",
      JSON.stringify(props.upgradeMap.current.get("autoClicker04")!.level)
    );
    localStorage.setItem(
      "AC5Level",
      JSON.stringify(props.upgradeMap.current.get("autoClicker05")!.level)
    );
    localStorage.setItem(
      "AC6Level",
      JSON.stringify(props.upgradeMap.current.get("autoClicker06")!.level)
    );
    localStorage.setItem(
      "AC7Level",
      JSON.stringify(props.upgradeMap.current.get("autoClicker07")!.level)
    );
    // console.log("Game saved");
    localStorage.setItem(
      "pool",
      JSON.stringify(props.upgradeEnergyMap.current.get("energyPool")!.level)
    );
    localStorage.setItem(
      "refill",
      JSON.stringify(props.upgradeEnergyMap.current.get("energyfill")!.level)
    );
    //console.log("Game setitem");
    // original// setOpenSnackbar(true);
    setOpenSnackbar(false);
  }
  function handleLoad() {
    props.balanceRef.current.value = parseInt(
      JSON.parse(localStorage.getItem("balanceRef") || "0")
    );
    loadUpgrade(
      "clickUpgrade",
      parseInt(JSON.parse(localStorage.getItem("Upgradeclick") || "0")),
      props.upgradeMap
    );
    loadUpgrade(
      "autoClicker01",
      parseInt(JSON.parse(localStorage.getItem("AC1Level") || "0")),
      props.upgradeMap
    );
    loadUpgrade(
      "autoClicker02",
      parseInt(JSON.parse(localStorage.getItem("AC2Level") || "0")),
      props.upgradeMap
    );
    loadUpgrade(
      "autoClicker03",
      parseInt(JSON.parse(localStorage.getItem("AC3Level") || "0")),
      props.upgradeMap
    );
    loadUpgrade(
      "autoClicker04",
      parseInt(JSON.parse(localStorage.getItem("AC4Level") || "0")),
      props.upgradeMap
    );
    loadUpgrade(
      "autoClicker05",
      parseInt(JSON.parse(localStorage.getItem("AC5Level") || "0")),
      props.upgradeMap
    );
    loadUpgrade(
      "autoClicker06",
      parseInt(JSON.parse(localStorage.getItem("AC6Level") || "0")),
      props.upgradeMap
    );
    loadUpgrade(
      "autoClicker07",
      parseInt(JSON.parse(localStorage.getItem("AC7Level") || "0")),
      props.upgradeMap
    );
    // console.log("Game loaded");
    loadUpgradeEnergy(
      "energyPool",
      parseInt(JSON.parse(localStorage.getItem("pool") || "0")),
      props.upgradeEnergyMap
    );
    loadUpgradeEnergy(
      "energyfill",
      parseInt(JSON.parse(localStorage.getItem("refill") || "0")),
      props.upgradeEnergyMap
    );
  }

  useEffect(() => {
    //loads latest save on app startup
    handleLoad();
    // eslint-disable-next-line
  }, []);
  /*
    Game is autosaved every 1 minute to increase
    time change 1400 to a higher number, to decrease time between
    saves change 1400 to a lower number.
  */
  const counter = useRef({ value: 0 });
  counter.current.value += 1;
  if (counter.current.value >= 10) {
    //1400
    handleSave();
    counter.current.value = 0;
  }

  function wipeSave() {
    props.balanceRef.current.value = parseInt(JSON.parse("0"));
    loadUpgrade("clickUpgrade", parseInt(JSON.parse("0")), props.upgradeMap);
    loadUpgrade("autoClicker01", parseInt(JSON.parse("0")), props.upgradeMap);
    loadUpgrade("autoClicker02", parseInt(JSON.parse("0")), props.upgradeMap);
    loadUpgrade("autoClicker03", parseInt(JSON.parse("0")), props.upgradeMap);
    loadUpgrade("autoClicker04", parseInt(JSON.parse("0")), props.upgradeMap);
    loadUpgrade("autoClicker05", parseInt(JSON.parse("0")), props.upgradeMap);
    loadUpgrade("autoClicker06", parseInt(JSON.parse("0")), props.upgradeMap);
    loadUpgrade("autoClicker07", parseInt(JSON.parse("0")), props.upgradeMap);
    loadUpgradeEnergy(
      "energyPool",
      parseInt(JSON.parse("0")),
      props.upgradeEnergyMap
    );
    loadUpgradeEnergy(
      "energyfill",
      parseInt(JSON.parse("0")),
      props.upgradeEnergyMap
    );
    localStorage.removeItem("balanceRef");
    localStorage.removeItem("Upgradeclick");
    localStorage.removeItem("AC1Level");
    localStorage.removeItem("AC2Level");
    localStorage.removeItem("AC3Level");
    localStorage.removeItem("AC4Level");
    localStorage.removeItem("AC5Level");
    localStorage.removeItem("AC6Level");
    localStorage.removeItem("AC7Level");
    localStorage.removeItem("pool");
    localStorage.removeItem("refill");
    props.balanceRef.current.value = parseInt(JSON.parse("0"));
    console.log("Game wiped");
    window.location.reload();
    handleClose();
  }
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCloseSnackbar = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
      <Button
        className="savehide"
        onClick={handleSave}
        style={{ margin: "10px 10px 30px 10px" }}
        variant="contained"
      >
        Save
      </Button>{" "}
      <br />
      <Button
        onClick={handleOpen}
        size="small"
        style={{ margin: "10px" }}
        variant="contained"
        color="error"
      >
        Wipe save
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            WARNING
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Do you REALLY want to wipe your save?
          </Typography>
          <Typography variant="caption">
            You will lose your progress, there is no going back!
          </Typography>
          <Button onClick={wipeSave}>Yes</Button>
          <Button onClick={handleClose}>No</Button>
        </Box>
      </Modal>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        message="Game saved"
      />
    </>
  );
}

const loadUpgrade = (
  id: string,
  level: number,
  upgradeMap: React.MutableRefObject<Map<string, UpgradeState>>
): void => {
  upgradeMap.current.get(id)!.loadUpgrade(level);
};
const loadUpgradeEnergy = (
  id: string,
  level: number,
  upgradeEnergyMap: React.MutableRefObject<Map<string, UpgradeEnergy>>
): void => {
  // const upgrade = upgradeEnergyMap.current.get(id);
  // if (upgrade) {
  //   upgrade.loadUpgrade(level);
  //}
  upgradeEnergyMap.current.get(id)!.loadUpgrade(level);
};

// import { Button, Box, Typography, Modal, Snackbar } from '@mui/material';
// import UpgradeState from "../classes/upgradeState";
// import React, { useEffect, useRef } from 'react';
// import UpgradeEnergy from '../classes/upgradeEnergy';

// const style = {
//   position: 'absolute' as 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 350,
//   bgcolor: 'rgb(14, 16, 17)',
//   border: '2px solid rgb(141, 130, 114)',
//   boxShadow: 24,
//   p: 3,
// };

// export function SaveGame(props: {
//   balanceRef: React.MutableRefObject<{value: number;}>,
//   upgradeMap: React.MutableRefObject<Map<string, UpgradeState>>,
//   upgradeEnergyMap: React.MutableRefObject<Map<string, UpgradeEnergy>>,
//   setMaxEnergy: React.Dispatch<React.SetStateAction<number>>,
//   setRefillRate: React.Dispatch<React.SetStateAction<number>>,
// }) {
//   const [openSnackbar, setOpenSnackbar] = React.useState(false);

//   function handleSave() {
//     localStorage.setItem("balanceRef", JSON.stringify(props.balanceRef.current.value));
//     localStorage.setItem("Upgradeclick", JSON.stringify(props.upgradeMap.current.get('clickUpgrade')!.level))
//     localStorage.setItem("AC1Level", JSON.stringify(props.upgradeMap.current.get('autoClicker01')!.level))
//     localStorage.setItem("AC2Level", JSON.stringify(props.upgradeMap.current.get('autoClicker02')!.level))
//     localStorage.setItem("AC3Level", JSON.stringify(props.upgradeMap.current.get('autoClicker03')!.level))
//     localStorage.setItem("AC4Level", JSON.stringify(props.upgradeMap.current.get('autoClicker04')!.level))
//     localStorage.setItem("AC5Level", JSON.stringify(props.upgradeMap.current.get('autoClicker05')!.level))
//     localStorage.setItem("AC6Level", JSON.stringify(props.upgradeMap.current.get('autoClicker06')!.level))
//     localStorage.setItem("AC7Level", JSON.stringify(props.upgradeMap.current.get('autoClicker07')!.level))
//     localStorage.setItem("pool",JSON.stringify(props.upgradeEnergyMap.current.get('energyPool')!.level))
//     localStorage.setItem("refill",JSON.stringify(props.upgradeEnergyMap.current.get('energyfill')!.level))
//     setOpenSnackbar(true);
//   }

//   function handleLoad() {
//     props.balanceRef.current.value = parseInt(JSON.parse(localStorage.getItem("balanceRef") || '0'));
//     loadUpgrade('clickUpgrade', parseInt(JSON.parse(localStorage.getItem("Upgradeclick") || '0')), props.upgradeMap)
//     loadUpgrade('autoClicker01', parseInt(JSON.parse(localStorage.getItem("AC1Level") || '0')), props.upgradeMap)
//     loadUpgrade('autoClicker02', parseInt(JSON.parse(localStorage.getItem("AC2Level") || '0')), props.upgradeMap)
//     loadUpgrade('autoClicker03', parseInt(JSON.parse(localStorage.getItem("AC3Level") || '0')), props.upgradeMap)
//     loadUpgrade('autoClicker04', parseInt(JSON.parse(localStorage.getItem("AC4Level") || '0')), props.upgradeMap)
//     loadUpgrade('autoClicker05', parseInt(JSON.parse(localStorage.getItem("AC5Level") || '0')), props.upgradeMap)
//     loadUpgrade('autoClicker06', parseInt(JSON.parse(localStorage.getItem("AC6Level") || '0')), props.upgradeMap)
//     loadUpgrade('autoClicker07', parseInt(JSON.parse(localStorage.getItem("AC7Level") || '0')), props.upgradeMap)

//     const poolLevel = parseInt(JSON.parse(localStorage.getItem("pool") || '0'));
//     const refillLevel = parseInt(JSON.parse(localStorage.getItem("refill") || '0'));

//     loadUpgradeEnergy('energyPool', poolLevel, props.upgradeEnergyMap)
//     loadUpgradeEnergy('energyfill', refillLevel, props.upgradeEnergyMap)

//     props.setMaxEnergy(prev => prev + (poolLevel * 50)); // Adjust as needed
//     props.setRefillRate(prev => prev + (refillLevel * 1)); // Adjust as needed
//   }

//   useEffect(() => {
//     handleLoad();
//     // eslint-disable-next-line
//   }, []);

//   const counter = useRef({ value: 0})
//   counter.current.value+=1;
//   if (counter.current.value >= 10) {
//     handleSave();
//     counter.current.value=0;
//   }

//   function wipeSave() {
//     props.balanceRef.current.value = parseInt(JSON.parse('0'));
//     loadUpgrade('clickUpgrade', parseInt(JSON.parse('0')), props.upgradeMap);
//     loadUpgrade('autoClicker01', parseInt(JSON.parse('0')), props.upgradeMap);
//     loadUpgrade('autoClicker02', parseInt(JSON.parse('0')), props.upgradeMap);
//     loadUpgrade('autoClicker03', parseInt(JSON.parse('0')), props.upgradeMap);
//     loadUpgrade('autoClicker04', parseInt(JSON.parse('0')), props.upgradeMap);
//     loadUpgrade('autoClicker05', parseInt(JSON.parse('0')), props.upgradeMap);
//     loadUpgrade('autoClicker06', parseInt(JSON.parse('0')), props.upgradeMap);
//     loadUpgrade('autoClicker07', parseInt(JSON.parse('0')), props.upgradeMap);
//     loadUpgradeEnergy('energyPool', parseInt(JSON.parse('0')), props.upgradeEnergyMap);
//     loadUpgradeEnergy('energyfill', parseInt(JSON.parse('0')), props.upgradeEnergyMap);
//     localStorage.removeItem("balanceRef");
//     localStorage.removeItem("Upgradeclick");
//     localStorage.removeItem("AC1Level");
//     localStorage.removeItem("AC2Level");
//     localStorage.removeItem("AC3Level");
//     localStorage.removeItem("AC4Level");
//     localStorage.removeItem("AC5Level");
//     localStorage.removeItem("AC6Level");
//     localStorage.removeItem("AC7Level");
//     localStorage.removeItem("pool");
//     localStorage.removeItem("refill");
//     props.balanceRef.current.value = parseInt(JSON.parse('0'));
//     console.log("Game wiped");
//     window.location.reload();
//     handleClose();
//   }

//   const [open, setOpen] = React.useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setOpenSnackbar(false);
//   };

//   return(
//     <>
//       <Button className='savehide' onClick={handleSave} style={{margin: "10px 10px 30px 10px"}} variant="contained">Save</Button> <br/>
//       <Button onClick={handleOpen} size="small" style={{margin: "10px"}} variant="contained" color="error">Wipe save</Button>
//       <Modal
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <Box sx={style}>
//           <Typography id="modal-modal-title" variant="h6" component="h2">
//             WARNING
//           </Typography>
//           <Typography id="modal-modal-description" sx={{ mt: 2 }}>
//             Do you REALLY want to wipe your save?
//           </Typography>
//           <Typography variant='caption'>
//             You will lose your progress, there is no going back!
//           </Typography>
//           <Button onClick={wipeSave}>Yes</Button>
//           <Button onClick={handleClose}>No</Button>
//         </Box>
//       </Modal>
//       <Snackbar
//         open={openSnackbar}
//         autoHideDuration={2000}
//         onClose={handleCloseSnackbar}
//         message="Game saved"
//       />
//     </>
//   )
// }

// const loadUpgrade = (
//   id: string,
//   level: number,
//   upgradeMap: React.MutableRefObject<Map<string, UpgradeState>>,
// ): void => {
//   upgradeMap.current.get(id)!.loadUpgrade(level);
// }

// const loadUpgradeEnergy = (
//   id: string,
//   level: number,
//   upgradeEnergyMap: React.MutableRefObject<Map<string, UpgradeEnergy>>,
// ): void => {
//   upgradeEnergyMap.current.get(id)!.loadUpgrade(level);
// }
