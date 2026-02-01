package com.asda.model.asdaCommands;

import com.asda.controller.asda.JpaContextListener;
import com.asda.Command;
import com.asda.CommandException;
import com.asda.CommandResponse;
import com.asda.beans.AccountBean;
import com.asda.model.accountsCommands.UserSessionManager;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
/**
 *
 * @author Marcela Tiemi Shinzato
 */
public class PublicGraph implements Command {
    
    @Override
    public CommandResponse execute(HttpServletRequest req, HttpServletResponse res)
        throws CommandException {
        CommandResponse response = new CommandResponse();
        response.setAjax(true);
        HttpSession session = req.getSession();
        UserSessionManager sessionMgr = UserSessionManager.getInstance();
        AccountBean account = sessionMgr.getAccountUser(session);
        String graphName = req.getParameter("graphName");
        if (graphName == null || graphName.isBlank()) {
            throw new CommandException("Graph name not provided.");
        }
        EntityManager em = JpaContextListener.getEmf().createEntityManager();
        try {
            em.getTransaction().begin();
            em.createNativeQuery(
                "UPDATE graphs SET publicGraph = NOT publicGraph " +
                "WHERE graph_name = ? AND user_id = ?"
            )
            .setParameter(1, graphName)
            .setParameter(2, account.getUserId())
            .executeUpdate();
            em.getTransaction().commit();
            Boolean updatedValue = (Boolean) em.createNativeQuery(
                "SELECT publicGraph FROM graphs WHERE graph_name = ? AND user_id = ?"
            )
            .setParameter(1, graphName)
            .setParameter(2, account.getUserId())
            .getSingleResult();
            response.setJsonPayload("{\"publicGraph\": " + updatedValue + "}");
            return response;

        } catch (NoResultException e) {
            throw new CommandException("Graph not found.");
        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            throw new CommandException("An error occurred while updating visibility.");
        } finally {
            em.close();
        }
    }
}
