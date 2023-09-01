<?php

namespace App\Repository;

use App\Entity\ProjectAttachment;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ProjectAttachment>
 *
 * @method ProjectAttachment|null find($id, $lockMode = null, $lockVersion = null)
 * @method ProjectAttachment|null findOneBy(array $criteria, array $orderBy = null)
 * @method ProjectAttachment[]    findAll()
 * @method ProjectAttachment[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProjectAttachmentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ProjectAttachment::class);
    }

//    /**
//     * @return ProjectAttachment[] Returns an array of ProjectAttachment objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('p.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?ProjectAttachment
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
