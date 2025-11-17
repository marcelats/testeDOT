package com.asda.model.asdaCommands;
import com.asda.controller.asda.JpaContextListener;
import com.asda.Command;
import com.asda.CommandException;
import com.asda.CommandResponse;
import com.asda.beans.AccountBean;

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
 * @author Felipe Osorio Thomé
 */
public class OpenGv implements Command {
    private CommandResponse aResponse;
    private EntityManager em;

    @Override
    public CommandResponse execute(HttpServletRequest req, HttpServletResponse res)
        throws CommandException, IOException {
        System.out.println("execute do opengv");
            HttpSession session = req.getSession();
            UserSessionManager sessionMgr = UserSessionManager.getInstance();
            AccountBean account = sessionMgr.getAccountUser(session);
            String graphName = req.getParameter("graphName");
String author = req.getParameter("author");
            
            if (graphName != null ) {
                String graph = findGv(account, graphName, author);

                if (graph != null ) {
                    System.out.println("graph!=null");

                    res.setContentType("text/plain;charset=UTF-8");  
                    PrintWriter out;
                    try {
                        out = res.getWriter();
                    } catch (IOException ex) {
                        throw new CommandException("IO Exception (response PrintWriter).");
                    }
                    out.print(graph);
                    out.flush();
                }
            }
            return aResponse;
        }

    private String findGv(AccountBean account, String graphName, String author)
        throws CommandException {
            String graph = null;
            try {
                System.out.println("try");
                em = JpaContextListener.getEmf().createEntityManager();
                System.out.println(em);
                graph = (String) em.createNamedQuery("graphs.findGv")
                        .setParameter("user", account.getUserId())
                        .setParameter("name", graphName)
                        .setParameter("author", author)
                        .getSingleResult();
                System.out.println(graph);
            } catch (NoResultException e) {
                System.out.println("catch 1");
                throw new CommandException("The graph name is invalid.");

            } catch (Exception e) {
System.out.println(e);
                throw new CommandException("An error occurred.");
            }
            finally{
                em.close();
            }

            return graph;
        }
}

