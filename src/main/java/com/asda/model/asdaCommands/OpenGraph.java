package com.asda.model.asdaCommands;

import com.asda.Command;
import com.asda.CommandException;
import com.asda.CommandResponse;
import com.asda.beans.AccountBean;
import com.asda.beans.GraphBean;
import com.asda.model.accountsCommands.UserSessionManager;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.NoResultException;
import jakarta.persistence.Persistence;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 *
 * @author Felipe Osorio Thomé
 */
public class OpenGraph implements Command {

    private static final String PERSISTENCE_UNIT = "ASDA_JSPPU";
    private CommandResponse aResponse;
    private EntityManagerFactory factory;
    private EntityManager manager;

    @Override
    public CommandResponse execute(HttpServletRequest req, HttpServletResponse res)
            throws CommandException {
        HttpSession session = req.getSession();
        UserSessionManager sessionMgr = UserSessionManager.getInstance();
        AccountBean account = sessionMgr.getAccountUser(session);

        String graphName = req.getParameter("graphName");

        if (graphName != null ) {
            factory = Persistence.createEntityManagerFactory(PERSISTENCE_UNIT);
            manager = factory.createEntityManager();

            GraphBean graph = findGraph(account, graphName);

            if (graph != null && Objects.equals(account.getUserId(), graph.getUser().getUserId())) {
                String graphJson = graph.getGraphJson();
                
                res.setContentType("application/json");    
                PrintWriter out;
                try {
                    out = res.getWriter();
                } catch (IOException ex) {
                    throw new CommandException("IO Exception (response PrintWriter).");
                }
                out.print(graphJson);
                out.flush();
            }

            manager.close();
            factory.close();
        }
        return aResponse;
    }

    private GraphBean findGraph(AccountBean account, String graphName)
            throws CommandException {
        GraphBean graph = null;
            factory = Persistence.createEntityManagerFactory(PERSISTENCE_UNIT);
            manager = factory.createEntityManager();
        try {
            graph = (GraphBean) manager.createNamedQuery("graphs.findGraph")
                    .setParameter("user", account)
                    .setParameter("name", graphName)
                    .getSingleResult();
        } catch (NoResultException e) {
            manager.close();
            factory.close();
            throw new CommandException("The graph name is invalid.");

        } catch (Exception e) {
            manager.close();
            factory.close();
            throw new CommandException("An error occurred.");
        }

        return graph;
    }
}
/* 
package com.asda.model.asdaCommands;

import com.asda.Command;
import com.asda.CommandException;
import com.asda.CommandResponse;
import com.asda.beans.AccountBean;
import com.asda.beans.GraphBean;
import com.asda.model.accountsCommands.UserSessionManager;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.NoResultException;
import jakarta.persistence.Persistence;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;


public class OpenGraph implements Command {

    private static final String PERSISTENCE_UNIT = "ASDA_JSPPU";
    private CommandResponse aResponse;
    private EntityManagerFactory factory;
    private EntityManager manager;
    AccountBean account;
    @Override
    public CommandResponse execute(HttpServletRequest req, HttpServletResponse res)
            throws CommandException, ServletException, IOException {
        HttpSession session = req.getSession();
        UserSessionManager sessionMgr = UserSessionManager.getInstance();
        account = sessionMgr.getAccountUser(session);
        
        return aResponse;
        //String graphName = req.getParameter("graphName");
        /////
        /*if (graphName != null) {
            factory = Persistence.createEntityManagerFactory(PERSISTENCE_UNIT);
            manager = factory.createEntityManager();
            
            GraphBean graph = findGraph(account, graphName);

            if (graph != null) {
                String graphJson = graph.getGraphJson();
                
                res.setContentType("application/json");    
                PrintWriter out;
                try {
                    out = res.getWriter();
                } catch (IOException ex) {
                    throw new CommandException("IO Exception (response PrintWriter).");
                }
                out.print(graphJson);
                out.flush();
            }

            manager.close();
            factory.close();
        }
        return aResponse;
    }

    public static GraphBean findGraph(HttpServletRequest req, HttpServletResponse res)
            throws CommandException {

        GraphBean graph = null;
        EntityManagerFactory factory = Persistence.createEntityManagerFactory(PERSISTENCE_UNIT);
        EntityManager manager = factory.createEntityManager();
        try {
                HttpSession session = req.getSession();
                UserSessionManager sessionMgr = UserSessionManager.getInstance();
                AccountBean account = sessionMgr.getAccountUser(session);
                graph = (GraphBean) manager.createNamedQuery("graphs.findGraph")
                   .setParameter("user", account)
                   .setParameter("name", graphName);
                
        
            //graficos =  manager.createNativeQuery("SELECT * FROM graph WHERE user_id = :userId UNION SELECT * FROM graph WHERE public_graph = true", 
//GraphBean.class).setParameter("userId", account).getResultList();
//graph = (GraphBean) manager.createNamedQuery("graphs.findGraph").setParameter("user", account).getSingleResult();


                    //.getSingleResult();
        } catch (NoResultException e) {
            manager.close();
            factory.close();
            throw new CommandException("The graph name is invalid.");
        
         } catch (Exception e) {
            manager.close();
            factory.close();
            throw new CommandException("An error occurred.");
        }
        
        return graph;
        
    }
}*/
