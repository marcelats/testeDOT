package com.asda.model.asdaCommands;
import com.asda.controller.asda.JpaContextListener;
import com.asda.Command;
import com.asda.CommandException;
import com.asda.CommandResponse;
import com.asda.beans.AccountBean;
import com.asda.beans.GraphBean;
import com.asda.model.accountsCommands.UserSessionManager;

import jakarta.persistence.EntityManager;

import jakarta.persistence.NoResultException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.util.Objects;

/**
 *
 * @author Felipe Osorio Thomé
 */
public class PublicGraph implements Command {

    private CommandResponse aResponse;

    private EntityManager em;

    @Override
    public CommandResponse execute(HttpServletRequest req, HttpServletResponse res)
            throws CommandException {

        HttpSession session = req.getSession();
        UserSessionManager sessionMgr = UserSessionManager.getInstance();
        AccountBean account = sessionMgr.getAccountUser(session);

        String graphName = req.getParameter("graphName");

        if (graphName != null ) {

            em = JpaContextListener.getEmf().createEntityManager();

            GraphBean graph = findGraph(account, graphName);
System.out.println(account.getUserId());
System.out.println(graph.getUser().getUserId());
            if (graph != null && Objects.equals(account.getUserId(), graph.getUser().getUserId())) {

        try {

em.getTransaction().begin();
           em.createNamedQuery("graphs.setPublic").setParameter("name", graphName).executeUpdate();
            em.getTransaction().commit();
        } catch (NoResultException e) {

            throw new CommandException("The graph name is invalid.");

        } catch (Exception e) {

            throw new CommandException("An error occurred.");
        }
        finally{em.close();}
            }

        }

        return aResponse;
    }

    private GraphBean findGraph(AccountBean account, String graphName)
            throws CommandException {
        GraphBean graph = null;
            em = JpaContextListener.getEmf().createEntityManager();
        try {
            graph = (GraphBean) em.createNamedQuery("graphs.findGraph")
                    .setParameter("user", account)
                    .setParameter("name", graphName)
                    .getSingleResult();
        } catch (NoResultException e) {

            throw new CommandException("The graph name is invalid.");

        } catch (Exception e) {

            throw new CommandException("An error occurred.");
        }
        finally{em.close();}

        return graph;
    }
}