package com.asda.model.asdaCommands;
import com.asda.controller.asda.JpaContextListener;
import com.asda.Command;
import com.asda.CommandException;
import com.asda.CommandResponse;
import com.asda.beans.AccountBean;
import com.asda.model.accountsCommands.UserSessionManager;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.Query;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
/**
 *
 * @author Felipe Osorio Thomé
 */
public class PublicGraph implements Command {

    private CommandResponse aResponse;

    private EntityManager em;

    @Override
    public CommandResponse execute(HttpServletRequest req, HttpServletResponse res)
        throws CommandException {

            HttpSession session = req.getSession();
            UserSessionManager sessionMgr = UserSessionManager.getInstance();
            AccountBean account = sessionMgr.getAccountUser(session);

            String graphName = req.getParameter("graphName");

            if (graphName != null ) {
                em = JpaContextListener.getEmf().createEntityManager();
                System.out.println(em);
                System.out.println(account.getUserId());
                try {

                    em.getTransaction().begin();
                    em.createNamedQuery("graphs.togglePublic")
                    .setParameter("user", account)
                    .setParameter("name", graphName).executeUpdate();
                    em.flush();
em.clear();
                    em.getTransaction().commit();
                    
                    
/*Query q = em.createNativeQuery(
    "UPDATE graphs SET publicgraph = NOT publicgraph WHERE graph_name = :name AND user_id = :user"
);
q.setParameter("name", graphName);
q.setParameter("user", account);
q.executeUpdate();*/

/*em.getTransaction().begin();


                em.createNativeQuery(
                    "UPDATE graphs SET publicgraph = NOT publicgraph WHERE graph_name = :name AND user_id = :user"
                )
                .setParameter("name", graphName)
.setParameter("user", account)
                .executeUpdate(); // <- ESSENCIAL

                em.getTransaction().commit();
                em.close();*/
/*Query q = em.createNativeQuery(
    "UPDATE graphs SET publicgraph = NOT publicgraph WHERE graph_name = :name AND user_id = :user"
);
q.setParameter("name", graphName);
q.setParameter("user", account);
q.executeUpdate();*/




                } catch (NoResultException e) {

                    throw new CommandException("The graph name is invalid.");

                } catch (Exception e) {
                    System.out.println(e);
                    throw new CommandException("An error occurred.");
                }   
                finally{em.close();}
            }
            return aResponse;
        }
}