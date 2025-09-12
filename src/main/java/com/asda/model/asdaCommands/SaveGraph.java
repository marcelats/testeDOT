package com.asda.model.asdaCommands;
import com.asda.controller.asda.JpaContextListener;
import com.asda.Command;
import com.asda.CommandException;
import com.asda.CommandResponse;
import com.asda.beans.AccountBean;
import com.asda.beans.GraphBean;
import com.asda.model.accountsCommands.UserSessionManager;
import jakarta.persistence.EntityManager;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.json.JSONObject;

/**
 *
 * @author Felipe Osorio Thomé
 */
public class SaveGraph implements Command {
    

    private CommandResponse aResponse;

    private EntityManager em;

    @Override
    public CommandResponse execute(HttpServletRequest req, HttpServletResponse res)
            throws CommandException {
        GraphBean graph = new GraphBean();
        JSONObject jObj;

        if (req.getParameter("graphJson") != null) {
            jObj = new JSONObject(req.getParameter("graphJson"));

            String graphName = jObj.getString("name");
            graph.setGraphName(graphName);
            try{
            HttpSession session = req.getSession();
            UserSessionManager sessionMgr = UserSessionManager.getInstance();
            AccountBean account = sessionMgr.getAccountUser(session);
            graph.setUser(account);
            
            graph.setGraphJson(jObj.toString());
            graph.setPublicGraph(false);
            System.out.println(graph.getPublicGraph());

           em = JpaContextListener.getEmf().createEntityManager();

            em.getTransaction().begin();
            em.persist(graph);
            em.getTransaction().commit();}
               finally{
            if(em!=null)em.close();}

        }

        return aResponse;
    }
}
