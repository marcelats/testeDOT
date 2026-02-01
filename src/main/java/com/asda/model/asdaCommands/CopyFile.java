package com.asda.model.asdaCommands;
import com.asda.controller.asda.JpaContextListener;
import com.asda.Command;
import com.asda.CommandException;
import com.asda.CommandResponse;
import com.asda.beans.AccountBean;
import com.asda.beans.GraphBean;
import com.asda.model.accountsCommands.UserSessionManager;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

/**
 *
 * @author Marcela Tiemi Shinzato
 */
public class CopyFile implements Command {

    private CommandResponse aResponse;

    @Override
    public CommandResponse execute(HttpServletRequest req, HttpServletResponse res)
        throws CommandException, IOException {
            HttpSession session = req.getSession();
            UserSessionManager sessionMgr = UserSessionManager.getInstance();
            AccountBean account = sessionMgr.getAccountUser(session);

            String graphName = req.getParameter("graphName");
            String author = req.getParameter("author");

            if (graphName != null ) {

                GraphBean graph = findGraph(account, graphName, author);

                if (graph != null) {
                    String graphJson = graph.getGraphJson();

                    res.setContentType("application/json");    
                    PrintWriter out;
                    try {
                        out = res.getWriter();
                        out.print(graphJson);
                        out.flush();
                    } catch (IOException ex) {
                        throw new CommandException("IO Exception (response PrintWriter).");
                    }

                }    
            }
            return aResponse;
        }

    private GraphBean findGraph(AccountBean account, String graphName, String author)
        throws CommandException {
            GraphBean graph = null;
            try (EntityManager em = JpaContextListener.getEmf().createEntityManager()) {
            System.out.println("userId: " + account.getUserId() + " author: " + author + " name: " + graphName);
                graph = (GraphBean) em.createNamedQuery("graphs.findGraphCopy")
                        .setParameter("user", account.getUserId())
                        .setParameter("author", author)
                        .setParameter("name", graphName)
                        .getSingleResult();
            } catch (NoResultException e) {

                throw new CommandException("The graph name is invalid.");

            } catch (Exception e) {

                System.out.println(e);
                throw new CommandException("An error occurred.");
            }

            return graph;
        }
}

