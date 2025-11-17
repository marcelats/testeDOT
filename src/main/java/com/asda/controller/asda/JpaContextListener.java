package com.asda.controller.asda;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

@WebListener
public class JpaContextListener implements ServletContextListener {

    private static EntityManagerFactory emf;

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        // Criado uma única vez no início da aplicação
        emf = Persistence.createEntityManagerFactory("ASDA_JSPPU");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        if (emf != null && emf.isOpen()) {
            emf.close(); // encerra todas as conexões
        }
    }


    // Para ser usado no resto da aplicação
    public static EntityManagerFactory getEmf() {
        return emf;
    }
}

