import React, { Fragment } from "react";
import { Link } from "react-router-dom";

import Header from "../../components/Header/Header";
import ButtonChapter from "../../components/ButtonChapter/ButtonChapter";
import Button from "../../components/Button/Button";

import "./Themes.css";

class Themes extends React.Component {
  state = {
    response: [],
    currentId: sessionStorage.getItem("id_ft"),
    currentCampaignName: sessionStorage.getItem("currentCampaignName"),
    currentCampaignId: ""
  };

  //récupère l'ID de la campagne et on le stocke dans le session storage et dans le state
  componentDidMount() {
    // console.log("themes/id de la FT : ", this.state.currentId);
    // console.log("themes/nom de la campagne : ", this.state.currentCampaignName);
    // console.log(sessionStorage.getItem("currentCampaignName"));
    this.callApi()
      .then(response => {
        //console.log(response);
        this.setState({ response });
        sessionStorage.setItem(
          "currentCampaignId",
          this.state.response[0].id_camp
        );
        this.setState({ currentCampaignId: this.state.response[0].id_camp });
        // console.log("themes / id de la campagne : ", this.state.currentCampaignId);
      })
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch(
      `/api/campaign_id/${this.state.currentId}/${
        this.state.currentCampaignName
      }`
    );
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  //au click valide la campagne en changeant le statut 0--> 1
  handleClick = () => {
    console.log(this.state.currentId, this.state.currentCampaignId);
    const campaign_infos = {
      id_ft: this.state.currentId,
      id_camp: this.state.currentCampaignId
    };
    const fetch_param = {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(campaign_infos)
    };

    fetch("/api/changeStatusCampaign", fetch_param)
      .then(function(results) {
        return results.json();
      })
      .then(function(myresults) {});

    window.alert(
      "Bravo, vous avez terminé la campagne!\nVous pouvez maintenant aller voir les résultats et les comparer aux campagnes précédentes"
    );
    window.location = `/board/${this.state.currentId}`;
  };

  render() {
    return (
      <Fragment>
        <Header
          header="header"
          className="buttonreturn"
          teamName={sessionStorage.getItem("currentFTName")}
          teamNameClass="header_team"
        />
        <div className="space">
          <p className="p_explication">
            Ce questionnaire est composé de 49 questions réparties en trois
            chapitres. {<br />}
            Vous pouvez y répondre dans l'ordre que vous souhaitez. {<br />}
            Vous pouvez quitter le questionnaire et y revenir plus tard.
          </p>

          <Link to="/campaign/process">
            <ButtonChapter
              textQuestion="CHAPITRE PROCESS"
              border="ChapterBorder"
            />
          </Link>

          <Link to="/campaign/qualite">
            <ButtonChapter
              textQuestion="CHAPITRE QUALITE"
              border="ChapterBorder"
            />
          </Link>

          <Link to="/campaign/valeurs">
            <ButtonChapter
              textQuestion="CHAPITRE VALEURS"
              border="ChapterBorder"
            />
          </Link>
          <Button
            textButton="Valider le questionnaire"
            onClick={this.handleClick}
            classButton="ValideBtn"
          />
        </div>
      </Fragment>
    );
  }
}

export default Themes;
