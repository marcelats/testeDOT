package com.asda;

import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;

@ApplicationPath("/ROOT") // ou "/api" se quiser que os endpoints comecem com /api
public class RestApplication extends Application {
    // vazia: usada apenas para ativar o JAX-RS
}
