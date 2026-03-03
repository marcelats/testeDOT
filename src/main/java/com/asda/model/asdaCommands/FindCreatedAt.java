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
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;


/**
 *
 * @author Felipe Osorio Thomé
 * @author Marcela Tiemi Shinzato
 */
public class FindCreatedAt implements Command {
    private CommandResponse aResponse;
    private EntityManager em;

    @Override
    public CommandResponse execute(HttpServletRequest req, HttpServletResponse res)
        throws CommandException, IOException {
            HttpSession session = req.getSession();
            UserSessionManager sessionMgr = UserSessionManager.getInstance();
            AccountBean account = sessionMgr.getAccountUser(session);
            String graphName = req.getParameter("graphName");
            System.out.println(graphName);
            System.out.println(account.getUserId());
            //String author = req.getParameter("author");
            if (graphName != null ) {
                String createdAt = findCreatedAt(account, graphName);
                if (createdAt != null ) {
                    res.setContentType("text/plain;charset=UTF-8");  
                    PrintWriter out;
                    try {
                        out = res.getWriter();
                    } catch (IOException ex) {
                        throw new CommandException("IO Exception (response PrintWriter).");
                    }
                    out.print(createdAt);
                    out.flush();
                }
            }
            return aResponse;
        }

    private String findCreatedAt(AccountBean account, String graphName)
        throws CommandException {
            LocalDateTime createdAt = null;
            try {
                em = JpaContextListener.getEmf().createEntityManager();
                createdAt = em.createNamedQuery("graphs.findCreatedAt", LocalDateTime.class)
                        .setParameter("name", graphName)
                        .setParameter("user", account.getUserId())
                        //.setParameter("author", author)
                        .getSingleResult();
                System.out.println(createdAt);
            } catch (NoResultException e) {
                throw new CommandException("The graph name is invalid.");
            } catch (Exception e) {
                System.out.println(e);
                throw new CommandException("Only the author can rename.");
            } finally {
                em.close();
            }
            return createdAt.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));
        }
}

