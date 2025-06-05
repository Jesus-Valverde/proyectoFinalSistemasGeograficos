// src/pages/Inicio.jsx
import React from "react";
import { Box, Typography, Button, Stack, Link as MuiLink } from "@mui/material";
import { Facebook, Instagram, GitHub, LinkedIn } from "@mui/icons-material";

const Inicio = () => {
    return (
        <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            alignItems="center"
            justifyContent="space-between"
            gap={4}
            sx={{ minHeight: "100%", mt: 4 }}
        >
            <Box maxWidth="600px" sx={{ fontFamily: "Montserrat, sans-serif" }}>
                <Typography variant="subtitle1" color="FFFFF" gutterBottom>
                    ¡HOLA!, SOY
                </Typography>
                <Typography variant="h3" fontWeight={800} gutterBottom>
                    JESÚS VALVERDE
                </Typography>
                <Typography variant="h4" gutterBottom fontWeight={800} sx={{ color: "#FF3131", fontFamily: "Montserrat, sans-serif" }}>
                    DESARROLLADOR WEB
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    Actualmente estoy aprendiendo la ruta del diseño y desarrollo web. Este es mi proyecto final para aprender a desarrollar aplicaciones con React y VITE.
                </Typography>
                <Stack direction="row" spacing={2} mb={2} justifyContent="center">
                    <MuiLink href="https://facebook.com/jesusmanuel.valverdeperez" target="_blank" color="inherit">
                        <Facebook fontSize="large" />
                    </MuiLink>
                    <MuiLink href="https://instagram.com/jes.v4l" target="_blank" color="inherit">
                        <Instagram fontSize="large" />
                    </MuiLink>
                    <MuiLink href="https://github.com/Jesus-Valverde" target="_blank" color="inherit">
                        <GitHub fontSize="large" />
                    </MuiLink>
                    <MuiLink href="https://linkedin.com/in/jes-val" target="_blank" color="inherit">
                        <LinkedIn fontSize="large" />
                    </MuiLink>
                </Stack>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "#EEFB03",
                        color: "#000000",
                        fontFamily: "Montserrat, sans-serif",
                        borderRadius: "40px",
                        padding: "12px 30px",
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "14px",
                        letterSpacing: "1px",
                        '&:hover': {
                            backgroundColor: "#d4e302",
                        }
                    }}
                    href="https://wa.me/qr/D7NJBZ5NOQL3A1"
                    target="_blank"
                >
                    CONTÁCTAME
                </Button>


            </Box>
            <Box component="img" src="/images/img.png" alt="Puntero" sx={{ maxWidth: "400px", width: "100%" }} />
        </Box>
    );
};

export default Inicio;
