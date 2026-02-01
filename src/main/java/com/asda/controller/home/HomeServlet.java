package com.asda.controller.home;

import com.asda.utils.FlowControl;
import java.io.IOException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 *
 * @author Felipe Osorio Thomé
 * @author Marcela Tiemi Shinzato
 */
public class HomeServlet extends HttpServlet {
    
    private static final String WELCOME_PAGE = "/WEB-INF/view/index.jsp";

    @Override
    public void service(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        FlowControl.forward(WELCOME_PAGE, req, res);
        
        try (EntityManagerFactory factory = Persistence.createEntityManagerFactory("ASDA_JSPPU")) {
            EntityManager manager = factory.createEntityManager();
            manager.close();
        }

    }
}
