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
public class PublicGraph implements Command {

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
System.out.println(account.getUserId());
System.out.println(graph.getUser().getUserId());
            if (graph != null && Objects.equals(account.getUserId(), graph.getUser().getUserId())) {

            factory = Persistence.createEntityManagerFactory(PERSISTENCE_UNIT);
            manager = factory.createEntityManager();
        try {

manager.getTransaction().begin();
            manager.createNamedQuery("graphs.setPublic").setParameter("name", graphName).executeUpdate();
            manager.getTransaction().commit();
        } catch (NoResultException e) {
            manager.close();
            factory.close();
            throw new CommandException("The graph name is invalid.");

        } catch (Exception e) {
            manager.close();
            factory.close();
            throw new CommandException("An error occurred.");
        }
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