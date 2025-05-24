package com.asda.model.asdaCommands;

import com.asda.Command;
import com.asda.CommandException;
import com.asda.CommandResponse;
import com.asda.beans.AccountBean;
import com.asda.beans.GraphBean;
import com.asda.model.accountsCommands.UserSessionManager;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.json.JSONObject;

/**
 *
 * @author Felipe Osorio Thomé
 */
public class SaveGraph implements Command {
    
    private static final String PERSISTENCE_UNIT = "ASDA_JSPPU";
    private CommandResponse aResponse;
    private EntityManagerFactory factory;
    private EntityManager manager;

    @Override
    public CommandResponse execute(HttpServletRequest req, HttpServletResponse res)
            throws CommandException {
        GraphBean graph = new GraphBean();
        JSONObject jObj;

        if (req.getParameter("graphJson") != null) {
            jObj = new JSONObject(req.getParameter("graphJson"));

            String graphName = jObj.getString("name");
            graph.setGraphName(graphName);
            
            HttpSession session = req.getSession();
            UserSessionManager sessionMgr = UserSessionManager.getInstance();
            AccountBean account = sessionMgr.getAccountUser(session);
            graph.setUser(account);
            
            graph.setGraphJson(jObj.toString());
            graph.setPublicGraph(false);
            factory = Persistence.createEntityManagerFactory(PERSISTENCE_UNIT);
            manager = factory.createEntityManager();

            manager.getTransaction().begin();
            manager.persist(graph);
            manager.getTransaction().commit();

            manager.close();
            factory.close();
        }

        return aResponse;
    }
}
