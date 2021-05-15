using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Persistence;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using System.Collections.Generic;

namespace Application.Profiles
{
    public class List
    {
        public class Query: IRequest<Result<List<UserProfileDto>>>
        {
            
        }

        public class Handler : IRequestHandler<Query, Result<List<UserProfileDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }
            public async Task<Result<List<UserProfileDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var users = await _context.Users.ProjectTo<UserProfileDto>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                if(users == null) return null;

                return Result<List<UserProfileDto>>.Success(users);
            }
        }
    }
}