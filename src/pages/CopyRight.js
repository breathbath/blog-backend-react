import Typography from "@material-ui/core/Typography/Typography";
import Link from "@material-ui/core/Link/Link";
import React from "react";

export default function CopyRight() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Built with love by the '}
            <Link color="inherit" href="https://material-ui.com/">
                Material-UI
            </Link>
            {' team.'}
        </Typography>
    );
}