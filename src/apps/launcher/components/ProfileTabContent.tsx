import React, { useState } from "react";
import { ProfilePromoItem } from "./ProfilePromoItem";
import { ApplicationEnvironment } from "../../../enums/ApplicationEnvironment";
import { ApplicationProfile } from "../../../utility/ApplicationProfile";
import { ConfigClient } from "../../../utility/ConfigClient";
import { useApp } from "../context/AppContext";

export interface ProfileTabContentProps {
  profile: any;
  active: boolean
};

export const ProfileTabContent = function(props: ProfileTabContentProps){
  const [render, rerender] = useState(false);
  const myContext = useApp();
  const [selectedProfileValue, setSelectedProfile] = myContext.selectedProfile;
  const profile = props.profile;
  const active = props.active;

  const btnLocate = () => {
    if(ApplicationProfile.ENV == ApplicationEnvironment.ELECTRON){
      (window as any).electron.locate_game_directory(profile).then( (directory: string) => {
        console.log('directory', directory);
        if(directory){
          ConfigClient.set(`Profiles.${profile.key}.directory`, directory);
          profile.directory = directory;
          rerender(!render);
        }
      }).catch( (e: any) => {
        console.error(e);
      });
    }else{
      // let handle = await window.showDirectoryPicker({
      //   mode: "readwrite"
      // });
      // if(handle){
      //   if ((await handle.requestPermission({ mode: 'readwrite' })) === 'granted') {
      //     ConfigClient.set(`Profiles.${profile.key}.directory_handle`, handle);
      //     buildProfileElement(ConfigClient.get(`Profiles.${profile.key}`));
      //     setLauncherOption(profile.key);
      //   }
      // }
    }
  };

  const btnLaunch = () => {
    let clean_profle = Object.assign({}, profile);
    if(ApplicationProfile.ENV == ApplicationEnvironment.ELECTRON){
      (window as any).electron.launchProfile(clean_profle);
    }else{
      window.open(`/${clean_profle.launch.path}?key=${clean_profle.key}`);
    }
  };

  const btnLaunchExecutable = () => {

  };

  let launch_buttons: JSX.Element[] = [];

  let executable_btn: JSX.Element|undefined;
  if(ApplicationProfile.ENV == ApplicationEnvironment.ELECTRON && profile.executable){
    executable_btn = <a href="#" className="btn-launch-executable" data-executable={ ApplicationProfile.isMac ? profile.executable.mac : profile.executable.win } title="Click here to launch the original game." key="launch-btn-execute" onClick={(e) => {e.preventDefault(); btnLaunchExecutable()}}>Launch Original</a>;
  }

  let tpl_launch_locate = <a href="#" className="btn-launch locate" key="launch-btn-locate" onClick={(e) => {e.preventDefault(); btnLocate()}}>Locate</a>;
  let tpl_launch_buttons = <a href="#" className="btn-launch" key="launch-btn-launch" onClick={(e) => {e.preventDefault(); btnLaunch()}}>Launch</a>;

  launch_buttons = [];

  if(ApplicationProfile.ENV == ApplicationEnvironment.ELECTRON && !!profile.locate_required){
    if(profile.directory){
      launch_buttons.push(tpl_launch_buttons);
      if(executable_btn){
        launch_buttons.push(executable_btn);
      }
    }else{
      launch_buttons.push(tpl_launch_locate);
    }
  }else{
    //if(profile.directory_handle){
      launch_buttons.push(tpl_launch_buttons);
    //}
  }

  return (
    <div id={profile.key} className={`launcher-content ${active ? `active` : ''}`}>
      <div className="logo-wrapper">
        <img className="logo" src={ profile.steam_id ? `https://steamcdn-a.akamaihd.net/steam/apps/${profile.steam_id}/logo.png?t=1437496165` : profile.logo } />
      </div>
      <div className="promo-elements">
        <div className="promo-elements-left"><i className="fas fa-chevron-left"></i></div>
        <div className="promo-elements-container">
          {
            profile.elements.map( (element: any, i: number) => {
              return <ProfilePromoItem element={element} key={`profile-proto-item-${i}`}></ProfilePromoItem>
            })
          }
        </div>
        <div className="promo-elements-right"><i className="fas fa-chevron-right"></i></div>
      </div>
      <div className="launch-btns">
        {
          launch_buttons.map( (element: JSX.Element, i: number) => {
            return element;
          })
        }
      </div>
    </div>
  );
}