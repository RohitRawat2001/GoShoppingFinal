import React from "react";
import "./aboutSection.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import YouTubeIcon from "@material-ui/icons/YouTube";
import InstagramIcon from "@material-ui/icons/Instagram";
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const About = () => {
    const visitInstagram = () => {
        window.location = "https://www.instagram.com/improve_yt_ff/";
    };
    return (
        <div className="aboutSection">
            <div></div>
            <div className="aboutSectionGradient"></div>
            <div className="aboutSectionContainer">
                <Typography component="h1">About Us</Typography>

                <div>
                    <div>
                        <Avatar
                            style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
                            src="https://res.cloudinary.com/dkymxspop/image/upload/v1709360784/avatars/r41rwujebyo1hj9jsvmr.jpg"
                            alt="Founder"
                        />
                        <Typography>Rohit Rawat</Typography>
                        <Button onClick={visitInstagram} color="primary">
                            Visit Instagram
                        </Button>
                        <span>
                            Hi There! 👋 I am Rohit Rawat
                        </span>
                    </div>
                    <div className="aboutSectionContainer2">
                        <Typography component="h2">Our Brands</Typography>
                        <a
                            href="https://www.youtube.com/@improveytff/videos"
                            target="blank"
                        >
                            <YouTubeIcon className="youtubeSvgIcon" />
                        </a>

                        <a href="https://www.instagram.com/improve_yt_ff/" target="blank">
                            <InstagramIcon className="instagramSvgIcon" />
                        </a>
                        <a href="https://www.linkedin.com/in/rohit-rawat-9a70b1230/" target="blank">
                            <LinkedInIcon className="instagramSvgIcon2" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About