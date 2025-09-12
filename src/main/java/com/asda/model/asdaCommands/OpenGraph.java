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
import java.util.Objects;

/**
 *
 * @author Felipe Osorio Thomé
 */
public class OpenGraph implements Command {
    private CommandResponse aResponse;
    private EntityManager em;

    @Override
    public CommandResponse execute(HttpServletRequest req, HttpServletResponse res)
            throws CommandException, IOException {
        HttpSession session = req.getSession();
        UserSessionManager sessionMgr = UserSessionManager.getInstance();
        AccountBean account = sessionMgr.getAccountUser(session);

        String graphName = req.getParameter("graphName");

        if(!Objects.equals(Long.valueOf(req.getParameter("author")), account.getUserId())){
        res.sendError(HttpServletResponse.SC_FORBIDDEN, "Copy the file first.");
    return aResponse;}
        if (graphName != null ) {
            

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

        }
        return aResponse;
    }

    private GraphBean findGraph(AccountBean account, String graphName)
            throws CommandException {
        GraphBean graph = null;
        try {

            em = JpaContextListener.getEmf().createEntityManager();
        
            graph = (GraphBean) em.createNamedQuery("graphs.findGraph")
                    .setParameter("user", account)
                    .setParameter("name", graphName)
                    .getSingleResult();
        } catch (NoResultException e) {
            
            throw new CommandException("The graph name is invalid.");

        } catch (Exception e) {
            
            throw new CommandException("An error occurred.");
        }
        finally{em.close();
            }

        return graph;
    }
}
