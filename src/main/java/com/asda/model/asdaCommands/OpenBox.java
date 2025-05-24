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
 */
public class OpenBox implements Command {
private static final String PERSISTENCE_UNIT = "ASDA_JSPPU";
    private static final String TYPE = "type";
    private static final String DIRECTORY = "/WEB-INF/view/";
    private CommandResponse aResponse;
private EntityManagerFactory factory;
    private EntityManager manager;
    @Override
    public CommandResponse execute(HttpServletRequest req, HttpServletResponse res)
            throws CommandException, ServletException, IOException {
        String type = req.getParameter(TYPE);
        HttpSession session = req.getSession();
        UserSessionManager sessionMgr = UserSessionManager.getInstance();
        AccountBean account = sessionMgr.getAccountUser(session);
        List<GraphBean> graph = findGraphs(account);   
        List<String> nomes = new ArrayList<>();
        for (GraphBean g : graph) {
            nomes.add(g.getGraphName());
        }
        req.setAttribute("arquivos", nomes);
        //essa linha fez o save virar open
        //req.getRequestDispatcher("/WEB-INF/view/opSave.jsp").forward(req, res);
        //req.getRequestDispatcher("/WEB-INF/view/opOpen.jsp").forward(req, res);

        switch (type) {
            case "new":
                aResponse = new CommandResponse();
                aResponse.setForward(true);
                aResponse.setPage(DIRECTORY + "opNew.jsp");
                break;
            case "save":
                req.getRequestDispatcher("/WEB-INF/view/opSave.jsp").forward(req, res);
                aResponse = new CommandResponse();
                aResponse.setForward(true);
                aResponse.setPage(DIRECTORY + "opSave.jsp");
                break;
            case "open":
                req.getRequestDispatcher("/WEB-INF/view/opOpen.jsp").forward(req, res);
                aResponse = new CommandResponse();
                aResponse.setForward(true);
                aResponse.setPage(DIRECTORY + "opOpen.jsp");
                break;
            case "parameters":
                aResponse = new CommandResponse();
                aResponse.setForward(true);
                aResponse.setPage(DIRECTORY + "opParam.jsp");
                break;
        }

        return aResponse;
    }
    public List<GraphBean> findGraphs(AccountBean account) throws CommandException 
    {
        List<GraphBean> graph = new ArrayList<>();
        factory = Persistence.createEntityManagerFactory(PERSISTENCE_UNIT);
        manager = factory.createEntityManager();
        try
        {
            graph = manager.createNamedQuery("graphs.findGraphs", GraphBean.class).setParameter("user", account).getResultList();
        }  
        catch (Exception e)
        {
            throw new CommandException("An error occurred.");
        } 
        finally 
        {
            manager.close();
            factory.close();
        }
        return graph;
    }
}
    

 /*
package com.asda.model.asdaCommands;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.asda.Command;
import com.asda.CommandException;
import com.asda.CommandResponse;
import com.asda.beans.AccountBean;
import com.asda.beans.GraphBean;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import com.asda.model.accountsCommands.UserSessionManager;
import com.asda.model.asdaCommands.OpenGraph;

public class OpenBox implements Command {

    private static final String TYPE = "type";
    private static final String DIRECTORY = "/WEB-INF/view/";
    private CommandResponse aResponse;

    @Override
    public CommandResponse execute(HttpServletRequest req, HttpServletResponse res)
            throws CommandException, ServletException, IOException {
        String type = req.getParameter(TYPE);
        
        //String nomes = arquivos.getGraphName(); new ArrayList<>();
        //for (GraphBean g : arquivos) {
        //    nomes.add(g.getGraphName());
       // }
       //HttpSession session = req.getSession();
        //UserSessionManager sessionMgr = UserSessionManager.getInstance();
        //AccountBean account = sessionMgr.getAccountUser(session);
        //GraphBean graph = OpenGraph.findGraph(account, "a");   
        //req.setAttribute("listaArquivos", graph.getGraphName());
        //req.getRequestDispatcher("/WEB-INF/view/opOpen.jsp").forward(req, res);

        switch (type) {
            case "new":
                aResponse = new CommandResponse();
                aResponse.setForward(true);
                aResponse.setPage(DIRECTORY + "opNew.jsp");
                break;
            case "save":
                aResponse = new CommandResponse();
                aResponse.setForward(true);
                aResponse.setPage(DIRECTORY + "opSave.jsp");
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
        }

        return aResponse;
    }
}*/