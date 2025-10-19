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
import org.json.JSONObject;

/**
 *
 * @author Felipe Osorio Thomé
 */
public class OpenReport implements Command {
    private CommandResponse aResponse;
    private EntityManager em;
    private String report, report_name;

    @Override
    public CommandResponse execute(HttpServletRequest req, HttpServletResponse res)
        throws CommandException, IOException {
            HttpSession session = req.getSession();
            UserSessionManager sessionMgr = UserSessionManager.getInstance();
            AccountBean account = sessionMgr.getAccountUser(session);
            String graphName = req.getParameter("graphName");
String author = req.getParameter("author");
            
            if (graphName != null ) {
                Object graph = findReport(account, graphName, author);

                if (graph != null) {
Object[] result = (Object[]) graph;
report = (String) result[0];
report_name = (String) result[1];
System.out.println("report : " + report);
System.out.println("report_name : " + report_name);
res.setContentType("application/json;charset=UTF-8");
res.setCharacterEncoding("UTF-8");

PrintWriter out = res.getWriter();
out.print("{\"report\":" + JSONObject.quote(report) + ", \"report_name\":" + JSONObject.quote(report_name) + "}");
out.flush();   

                    /*try {
                        out = res.getWriter();
                    } catch (IOException ex) {
                        throw new CommandException("IO Exception (response PrintWriter).");
                    }
                    out.print(graph);
                    out.flush();*/
                }
            }
            return aResponse;
        }

    private Object findReport(AccountBean account, String graphName, String author)
        throws CommandException {
            Object array = null;
            try {
                em = JpaContextListener.getEmf().createEntityManager();
                Object graph = em.createNamedQuery("graphs.findReport")
                        .setParameter("user", account.getUserId())
                        .setParameter("name", graphName)
                        .setParameter("author", author)
                        .getSingleResult();
               

array = (Object[]) graph; // só funciona se a implementação realmente retornar Object[]

            } catch (NoResultException e) {
                System.out.println(e);
                throw new CommandException("The graph name is invalid.");

            } catch (Exception e) {
System.out.println(e);
                throw new CommandException("An error occurred.");
            }
            finally{
                em.close();
            }

            return array;
        }
}



