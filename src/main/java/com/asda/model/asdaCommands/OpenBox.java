package com.asda.model.asdaCommands;
import com.asda.controller.asda.JpaContextListener;
import com.asda.Command;
import com.asda.CommandException;
import com.asda.CommandResponse;
import com.asda.beans.AccountBean;
import com.asda.beans.GraphBean;
import com.asda.model.accountsCommands.UserSessionManager;
import jakarta.persistence.EntityManager;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Felipe Osorio Thomé
 * @author Marcela Tiemi Shinzato
 */
public class OpenBox implements Command {

    private static final String TYPE = "type";
    private static final String DIRECTORY = "/WEB-INF/view/";
    private CommandResponse aResponse;

    private EntityManager em;
    @Override
    public CommandResponse execute(HttpServletRequest req, HttpServletResponse res)
        throws CommandException, ServletException, IOException {
            String type = req.getParameter(TYPE);
            HttpSession session = req.getSession();
            UserSessionManager sessionMgr = UserSessionManager.getInstance();
            AccountBean account = sessionMgr.getAccountUser(session);
            List<GraphBean> graph = findGraphs(account);   
            req.setAttribute("files", graph);
            req.setAttribute("currentUserId", account.getUserId());

            switch (type) {
                case "new":
                    aResponse = new CommandResponse();
                    aResponse.setForward(true);
                    aResponse.setPage(DIRECTORY + "opNew.jsp");
                    break;
                case "saveAs":
                    aResponse = new CommandResponse();
                    aResponse.setForward(true);
                    aResponse.setPage(DIRECTORY + "opSaveAs.jsp");
                    break;
                case "open":
                    aResponse = new CommandResponse();
                    aResponse.setForward(true);
                    aResponse.setPage(DIRECTORY + "opOpen.jsp");
                    break;
                case "parameters":
                    aResponse = new CommandResponse();
                    aResponse.setForward(true);
                    aResponse.setPage(DIRECTORY + "opParam.jsp");
                    break;
                case "arrival":
                    aResponse = new CommandResponse();
                    aResponse.setForward(true);
                    aResponse.setPage(DIRECTORY + "arrival.jsp");
                    break;
                case "editor":
                    aResponse = new CommandResponse();
                    aResponse.setForward(true);
                    aResponse.setPage(DIRECTORY + "textEditor.jsp");
                    break;
                case "showText":
                    aResponse = new CommandResponse();
                    aResponse.setForward(true);
                    aResponse.setPage(DIRECTORY + "showText.jsp");
                    break;
                case "prob":
                    aResponse = new CommandResponse();
                    aResponse.setForward(true);
                    aResponse.setPage(DIRECTORY + "probabilities.jsp");
                    break;
            }
        return aResponse;
    }
    public List<GraphBean> findGraphs(AccountBean account) throws CommandException 
    {
        List<GraphBean> graph = new ArrayList<>();

        em = JpaContextListener.getEmf().createEntityManager();
        try
        {
            graph = em.createNamedQuery("graphs.findGraphs", GraphBean.class).setParameter("user", account).getResultList();
        }  
        catch (Exception e)
        {
            throw new CommandException("An error occurred.");
        } 
        finally 
        {
            em.close();
        }
        return graph;
    }
}