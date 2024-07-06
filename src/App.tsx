import React, { useRef, useEffect, useReducer, useState } from "react";
import "./App.css";
//for ts
import UpgradeState from "./classes/upgradeState";
import UpgradeEnergy from "./classes/upgradeEnergy";
//
import UpgradeButton from "./components/upgradeButton";
import { ClickHandler } from "./components/clickHandler";
import { DisplayStats } from "./components/displayStats";
import { SaveGame } from "./components/saveGame";
//for booster
import UpgradeClick from "./components/click/upgradeClick";
import EnergyFill from "./components/click/energRefill";
import UpgradePool from "./components/click/poolUpgrade";
//for Task
import Task from "./components/OtherDiv/task";
//for Ref
import Refer from "./components/OtherDiv/ref";
//fire base
import {
  sendUserDataToFirebase,
  updateUserAutoIncrementInFirebase,
} from "./firebaseFunctions";

export function App() {
  const balanceRef = useRef({ value: 0 });
  const forceUpdate = useReducer((x) => x + 1, 0)[1];

  const [energy, setEnergy] = useState(10000);
  const [maxEnergy, setMaxEnergy] = useState(10000);
  const [refillRate, setRefillRate] = useState(1);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  //user
  const [userId, setUserId] = useState<string | null>(null);

  const [isInitialLoad, setIsInitialLoad] = useState(true); // Flag to check if initial load is done

  // Load state from localStorage on mount
  useEffect(() => {
    const storedEnergy = localStorage.getItem("energy");
    const storedMaxEnergy = localStorage.getItem("maxEnergy");
    const storedRefillRate = localStorage.getItem("refillRate");
    const storedLastUpdated = localStorage.getItem("lastUpdated");

    if (
      storedEnergy &&
      storedMaxEnergy &&
      storedRefillRate &&
      storedLastUpdated
    ) {
      const timePassed = (Date.now() - parseInt(storedLastUpdated, 10)) / 1000; // time in seconds
      console.log("timePassed (seconds):", timePassed);

      const storedRefillRateNum = parseInt(storedRefillRate, 10);
      const calculatedEnergy = Math.min(
        parseInt(storedEnergy, 10) +
          Math.floor(timePassed * storedRefillRateNum),
        parseInt(storedMaxEnergy, 10)
      );

      console.log("calculatedEnergy:", calculatedEnergy);

      setEnergy(calculatedEnergy);
      setMaxEnergy(parseInt(storedMaxEnergy, 10));
      setRefillRate(storedRefillRateNum);
      setLastUpdated(Date.now());
    }

    setIsInitialLoad(false); // Set initial load flag to false after loading from localStorage
  }, []);

  // Save state to localStorage only after the initial load is complete
  useEffect(() => {
    if (!isInitialLoad) {
      localStorage.setItem("energy", energy.toString());
      localStorage.setItem("maxEnergy", maxEnergy.toString());
      localStorage.setItem("refillRate", refillRate.toString());
      localStorage.setItem("lastUpdated", lastUpdated.toString());
    }
  }, [energy, maxEnergy, refillRate, lastUpdated, isInitialLoad]);

  useEffect(() => {
    // Initialize the Telegram Web App SDK
    const initTelegram = () => {
      const tg = window.Telegram.WebApp;
      tg.ready();
      // Debug logging
      console.log("Telegram Web App SDK initialized");
      console.log("tg.initDataUnsafe:", tg.initDataUnsafe);

      const user = tg.initDataUnsafe?.user;

      if (user) {
        const id = user.id.toString();
        setUserId(user.id.toString());
        sendUserDataToFirebase(id, autoIncrement);
      }
    };

    if (window.Telegram) {
      console.log("Telegram SDK is already loaded");
      initTelegram();
    } else {
      console.log("Waiting for Telegram SDK to be ready");
      window.addEventListener("TelegramWebAppReady", initTelegram);
    }

    return () => {
      window.removeEventListener("TelegramWebAppReady", initTelegram);
    };
  }, []);

  //up is user

  const upgradeMap = useRef(
    new Map<string, UpgradeState>([
      ["clickUpgrade", new UpgradeState(15, 2, 1, 2)],
      ["autoClicker01", new UpgradeState(80, 2, 0, 0.1)],
      ["autoClicker02", new UpgradeState(200, 2, 0, 0.5)],
      ["autoClicker03", new UpgradeState(1000, 2, 0, 0.8)],
      ["autoClicker04", new UpgradeState(5000, 2, 0, 1)],
      ["autoClicker05", new UpgradeState(5000, 2, 0, 1)],
      ["autoClicker06", new UpgradeState(5000, 2, 0, 1)],
      ["autoClicker07", new UpgradeState(10000, 2, 0, 1.5)],
    ])
  );

  const upgradeEnergyMap = useRef(
    new Map<string, UpgradeEnergy>([
      ["energyPool", new UpgradeEnergy(40, 1.4, 50, 0)],
      ["energyfill", new UpgradeEnergy(70, 2, 0, 1)],
      // Add other entries as needed
    ])
  );

  let autoIncrement: number =
    Math.round(
      (upgradeMap.current.get("autoClicker01")!.increment +
        upgradeMap.current.get("autoClicker02")!.increment +
        upgradeMap.current.get("autoClicker03")!.increment +
        upgradeMap.current.get("autoClicker04")!.increment +
        upgradeMap.current.get("autoClicker05")!.increment +
        upgradeMap.current.get("autoClicker06")!.increment +
        upgradeMap.current.get("autoClicker07")!.increment) *
        100
    ) / 100;

  //database
  useEffect(() => {
    if (userId !== null) {
      updateUserAutoIncrementInFirebase(userId, autoIncrement);
    }
  }, [autoIncrement]);
  //databse

  useEffect(() => {
    const interval = setInterval(() => {
      balanceRef.current.value =
        Math.round((balanceRef.current.value + autoIncrement / 10) * 100) / 100;
      forceUpdate();
    }, 100);

    return () => clearInterval(interval);
  });

  useEffect(() => {
    const refillInterval = setInterval(() => {
      setEnergy((prevEnergy) => Math.min(prevEnergy + refillRate, maxEnergy));
    }, 1000);

    return () => clearInterval(refillInterval);
  }, [refillRate, maxEnergy]);

  const upgradeInvocationHandler = (
    id: string,
    upgradeMap: React.MutableRefObject<Map<string, UpgradeState>>,
    upgradeEnergyMap: React.MutableRefObject<Map<string, UpgradeEnergy>>,
    balanceRef: React.MutableRefObject<{ value: number }>,
    setMaxEnergy: React.Dispatch<React.SetStateAction<number>>,
    setRefillRate: React.Dispatch<React.SetStateAction<number>>
  ): void => {
    if (upgradeMap.current.has(id)) {
      const cost = upgradeMap.current.get(id)!.currentCost;
      if (upgradeMap.current.get(id)!.upgrade(balanceRef.current.value)) {
        console.log(`Upgraded ${id} component.`);
        balanceRef.current.value =
          Math.round((balanceRef.current.value - cost) * 100) / 100;
      } else {
        console.log(`Balance is too low to upgrade ${id} component.`);
      }
    } else if (upgradeEnergyMap.current.has(id)) {
      const cost = upgradeEnergyMap.current.get(id)!.currentCost;
      if (upgradeEnergyMap.current.get(id)!.upgrade(balanceRef.current.value)) {
        console.log(`Upgraded ${id} energy component.`);
        balanceRef.current.value =
          Math.round((balanceRef.current.value - cost) * 100) / 100;
        // Handle changes to energy attributes
        if (id === "energyPool") {
          const newMaxEnergy =
            upgradeEnergyMap.current.get(id)!.maxEnergyIncrement;
          setMaxEnergy((prevMaxEnergy) => prevMaxEnergy + newMaxEnergy);
          console.log("energy pool+");
        } else if (id === "energyfill") {
          const newRefillRate =
            upgradeEnergyMap.current.get(id)!.energyRefillIncrement;
          setRefillRate((prevRefillRate) => prevRefillRate + newRefillRate);
          console.log("energy +");
        }
      } else {
        console.log(`Balance is too low to upgrade ${id} energy component.`);
      }
    }
  };

  const handleRewardClaimed = () => {
    forceUpdate(); // Force an update to reflect the new balance
  };

  return (
    <>
      <div className="overlay">
        <div className="container-fluid">
          <div className="row">
            {/*1r-1c first row first col */}
            <div className="col-md col-lg-5">
              <ClickHandler
                balanceRef={balanceRef}
                increment={upgradeMap.current.get("clickUpgrade")!.increment}
                energy={energy}
                maxEnergy={maxEnergy}
                setEnergy={setEnergy}
              />
              <DisplayStats
                balanceRef={balanceRef}
                clickIncrement={
                  upgradeMap.current.get("clickUpgrade")!.increment
                }
                autoIncrement={autoIncrement}
                refillRate={refillRate}
              />
              <SaveGame
                balanceRef={balanceRef}
                upgradeMap={upgradeMap}
                upgradeEnergyMap={upgradeEnergyMap}
                //  setMaxEnergy={setMaxEnergy}
                //  setRefillRate={setRefillRate}
              />
            </div>
            {/* 1r first row */}
            <div className="col-md-12 col-lg-7">
              <h1>UPGRADES</h1>
              <div className="row">
                <div className="center col-6 col-sm-6 col-md-6 col-lg-6">
                  <UpgradeButton
                    id="autoClicker01"
                    name="Slime"
                    level={upgradeMap.current.get("autoClicker01")!.level}
                    cost={upgradeMap.current.get("autoClicker01")!.currentCost}
                    increment={
                      upgradeMap.current.get("autoClicker01")!.incrementAdd
                    }
                    balance={balanceRef.current.value}
                    autoIncrementTotal={autoIncrement}
                    clickHandler={(id) => {
                      upgradeInvocationHandler(
                        id,
                        upgradeMap,
                        upgradeEnergyMap,
                        balanceRef,
                        setMaxEnergy,
                        setRefillRate
                      );
                    }}
                  />
                  <UpgradeButton
                    id="autoClicker03"
                    name="Warrior"
                    level={upgradeMap.current.get("autoClicker03")!.level}
                    cost={upgradeMap.current.get("autoClicker03")!.currentCost}
                    increment={
                      upgradeMap.current.get("autoClicker03")!.incrementAdd
                    }
                    balance={balanceRef.current.value}
                    autoIncrementTotal={autoIncrement}
                    clickHandler={(id) => {
                      upgradeInvocationHandler(
                        id,
                        upgradeMap,
                        upgradeEnergyMap,
                        balanceRef,
                        setMaxEnergy,
                        setRefillRate
                      );
                    }}
                  />
                  <UpgradeButton
                    id="autoClicker05"
                    name="ELF"
                    level={upgradeMap.current.get("autoClicker05")!.level}
                    cost={upgradeMap.current.get("autoClicker05")!.currentCost}
                    increment={
                      upgradeMap.current.get("autoClicker05")!.incrementAdd
                    }
                    balance={balanceRef.current.value}
                    autoIncrementTotal={autoIncrement}
                    clickHandler={(id) => {
                      upgradeInvocationHandler(
                        id,
                        upgradeMap,
                        upgradeEnergyMap,
                        balanceRef,
                        setMaxEnergy,
                        setRefillRate
                      );
                    }}
                  />
                  <UpgradeButton
                    id="autoClicker07"
                    name="Wizard"
                    level={upgradeMap.current.get("autoClicker07")!.level}
                    cost={upgradeMap.current.get("autoClicker07")!.currentCost}
                    increment={
                      upgradeMap.current.get("autoClicker07")!.incrementAdd
                    }
                    balance={balanceRef.current.value}
                    autoIncrementTotal={autoIncrement}
                    clickHandler={(id) => {
                      upgradeInvocationHandler(
                        id,
                        upgradeMap,
                        upgradeEnergyMap,
                        balanceRef,
                        setMaxEnergy,
                        setRefillRate
                      );
                    }}
                  />
                </div>
                <div className="center col-6 col-sm-6 col-md-6 col-lg-6">
                  <UpgradeButton
                    id="autoClicker02"
                    name="Goblin"
                    level={upgradeMap.current.get("autoClicker02")!.level}
                    cost={upgradeMap.current.get("autoClicker02")!.currentCost}
                    increment={
                      upgradeMap.current.get("autoClicker02")!.incrementAdd
                    }
                    balance={balanceRef.current.value}
                    autoIncrementTotal={autoIncrement}
                    clickHandler={(id) => {
                      upgradeInvocationHandler(
                        id,
                        upgradeMap,
                        upgradeEnergyMap,
                        balanceRef,
                        setMaxEnergy,
                        setRefillRate
                      );
                    }}
                  />
                  <UpgradeButton
                    id="autoClicker04"
                    name="Knight"
                    level={upgradeMap.current.get("autoClicker04")!.level}
                    cost={upgradeMap.current.get("autoClicker04")!.currentCost}
                    increment={
                      upgradeMap.current.get("autoClicker04")!.incrementAdd
                    }
                    balance={balanceRef.current.value}
                    autoIncrementTotal={autoIncrement}
                    clickHandler={(id) => {
                      upgradeInvocationHandler(
                        id,
                        upgradeMap,
                        upgradeEnergyMap,
                        balanceRef,
                        setMaxEnergy,
                        setRefillRate
                      );
                    }}
                  />
                  <UpgradeButton
                    id="autoClicker06"
                    name="Dwarf"
                    level={upgradeMap.current.get("autoClicker06")!.level}
                    cost={upgradeMap.current.get("autoClicker06")!.currentCost}
                    increment={
                      upgradeMap.current.get("autoClicker06")!.incrementAdd
                    }
                    balance={balanceRef.current.value}
                    autoIncrementTotal={autoIncrement}
                    clickHandler={(id) => {
                      upgradeInvocationHandler(
                        id,
                        upgradeMap,
                        upgradeEnergyMap,
                        balanceRef,
                        setMaxEnergy,
                        setRefillRate
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {/*2r second row for Booster */}
          <div className="booster row">
            <h2>Booster</h2>
            <div className="col-sm-12 col-md-12 col-lg-12">
              <UpgradeClick
                id="clickUpgrade"
                name="Tab Booster"
                level={upgradeMap.current.get("clickUpgrade")!.level}
                cost={upgradeMap.current.get("clickUpgrade")!.currentCost}
                increment={upgradeMap.current.get("clickUpgrade")!.incrementAdd}
                balance={balanceRef.current.value}
                autoIncrementTotal={autoIncrement}
                clickHandler={(id) => {
                  upgradeInvocationHandler(
                    id,
                    upgradeMap,
                    upgradeEnergyMap,
                    balanceRef,
                    setMaxEnergy,
                    setRefillRate
                  );
                }}
              />
            </div>
            {/* <div className="col-sm-6 col-md-6 col-lg-4">
              <EnergyFill
                id="energyfill"
                name="Energy Refill"
                level={upgradeEnergyMap.current.get("energyfill")!.level}
                cost={upgradeEnergyMap.current.get("energyfill")!.currentCost}
                increment={
                  upgradeEnergyMap.current.get("energyfill")!
                    .energyRefillIncrement
                }
                balance={balanceRef.current.value}
                autoIncrementTotal={autoIncrement}
                clickHandler={(id) => {
                  upgradeInvocationHandler(
                    id,
                    upgradeMap,
                    upgradeEnergyMap,
                    balanceRef,
                    setMaxEnergy,
                    setRefillRate
                  );
                }}
              />
            </div>
            <div className="col-sm-6 col-md-6 col-lg-4">
              <UpgradePool
                id="energyPool"
                name="Energy Pool"
                level={upgradeEnergyMap.current.get("energyPool")!.level}
                cost={upgradeEnergyMap.current.get("energyPool")!.currentCost}
                increment={
                  upgradeEnergyMap.current.get("energyPool")!.maxEnergyIncrement
                }
                balance={balanceRef.current.value}
                autoIncrementTotal={autoIncrement}
                clickHandler={(id) => {
                  upgradeInvocationHandler(
                    id,
                    upgradeMap,
                    upgradeEnergyMap,
                    balanceRef,
                    setMaxEnergy,
                    setRefillRate
                  );
                }}
              />
            </div> */}
          </div>
          {/* 3r third row for Task*/}
          <div className=" Task row">
            <h2>Follow Our Social And Get More Coin </h2>
            <div className="col-sm col-md-6 col-lg-4">
              <Task
                name="Follow on Telegram"
                reward={500}
                show="500"
                link="https://telegram.me"
                balanceRef={balanceRef}
                onRewardClaimed={handleRewardClaimed}
              />
            </div>
            <div className="col-sm col-md-6 col-lg-4">
              <Task
                name="Follow on X"
                reward={300}
                show="300"
                link="https://telegram.me"
                balanceRef={balanceRef}
                onRewardClaimed={handleRewardClaimed}
              />
            </div>
            <div className="col-sm col-md-6 col-lg-4">
              <Task
                name="Subscribe on youtube"
                reward={300}
                show="300"
                link="https://telegram.me"
                balanceRef={balanceRef}
                onRewardClaimed={handleRewardClaimed}
              />
            </div>
            <div className="col-sm col-md-6 col-lg-4">
              <Task
                name="Follow on Facebook"
                reward={300}
                show="300"
                link="https://telegram.me"
                balanceRef={balanceRef}
                onRewardClaimed={handleRewardClaimed}
              />
            </div>
            <div className="col-sm col-md-6 col-lg-4">
              <Task
                name="Tweet on X"
                reward={300}
                show="300"
                link="https://telegram.me"
                balanceRef={balanceRef}
                onRewardClaimed={handleRewardClaimed}
              />
            </div>
            <div className="col-sm col-md-6 col-lg-4">
              <Task
                name="Watch youtube video"
                reward={300}
                show="300"
                link="https://telegram.me"
                balanceRef={balanceRef}
                onRewardClaimed={handleRewardClaimed}
              />
            </div>
          </div>
          {/* 4th row for Ref */}
          <div className="Ref_box">{userId && <Refer userId={userId} />}</div>
          {/*down are overlay and container  */}
        </div>
      </div>
    </>
  );
}
